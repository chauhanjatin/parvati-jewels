const { prisma, withDbRetry } = require('./prisma');
const { pickStoneShape, STONE_SHAPES } = require('./productSpecifications');
const path = require('path');
const fs = require('fs');

let categoriesCache = null;
let allProductsCache = null;
let productsBySlugCache = new Map();
let lastCacheTime = 0;
let isWarmingUp = false;

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL

function parseVariantSpecs(variant) {
  if (!variant?.specifications) return {};
  try {
    return typeof variant.specifications === 'string'
      ? JSON.parse(variant.specifications)
      : variant.specifications;
  } catch {
    return {};
  }
}

function formatProductListItem(product) {
  let minPrice = 0;
  let maxPrice = 0;
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => Number(v.price) || 0);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  const specs = parseVariantSpecs(product.variants?.[0]);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    isBestseller: Boolean(product.isBestseller),
    primaryImage: product.images?.[0]?.imageUrl || null,
    category: product.category?.parent
      ? product.category.parent.slug
      : product.category?.slug,
    subCategory: product.category?.parent ? product.category.slug : null,
    subCategoryName: product.category?.parent ? product.category.name : null,
    stoneShape:
      specs.stone_shape ||
      pickStoneShape({ id: product.id, slug: product.slug }),
    weightDetails: specs.weightDetails || null,
    minPrice,
    maxPrice,
  };
}

/**
 * Preload all categories and all products into memory
 */
async function warmupCache(force = false) {
  const now = Date.now();
  if (!force && allProductsCache && (now - lastCacheTime < CACHE_TTL_MS)) {
    return;
  }
  if (isWarmingUp) return;
  isWarmingUp = true;

  const startTime = Date.now();
  try {
    console.log('[Cache] Preloading catalog from database into memory...');

    // 1. Fetch categories
    const categories = await withDbRetry(() =>
      prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            orderBy: { id: 'asc' },
          },
        },
        orderBy: { id: 'asc' },
      })
    );
    categoriesCache = categories;

    // 2. Fetch all products with all relations in ONE fast batch query
    const products = await withDbRetry(() =>
      prisma.product.findMany({
        include: {
          category: {
            include: { parent: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: true,
        },
        orderBy: { id: 'asc' },
      })
    );

    const formatted = products.map(formatProductListItem);

    formatted.sort((a, b) => {
      const ia = STONE_SHAPES.indexOf(a.stoneShape || '');
      const ib = STONE_SHAPES.indexOf(b.stoneShape || '');
      const orderA = ia === -1 ? STONE_SHAPES.length : ia;
      const orderB = ib === -1 ? STONE_SHAPES.length : ib;
      if (orderA !== orderB) return orderA - orderB;
      return String(a.name).localeCompare(String(b.name));
    });

    allProductsCache = formatted;
    lastCacheTime = Date.now();
    console.log(
      `[Cache] Preloaded ${formatted.length} products & ${categories.length} categories in ${Date.now() - startTime}ms`
    );
  } catch (error) {
    console.error('[Cache] Failed to load catalog from database:', error.message);
    // If DB fails, fallback to products.json if empty
    if (!allProductsCache) {
      loadFallbackFromJson();
    }
  } finally {
    isWarmingUp = false;
  }
}

function loadFallbackFromJson() {
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'products.json');
    if (fs.existsSync(jsonPath)) {
      const jsonProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      allProductsCache = jsonProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        isBestseller: Boolean(p.isBestseller),
        primaryImage: p.image?.startsWith('..')
          ? p.image.replace('..', '')
          : p.image,
        category: p.category === 'pendants' ? 'pendant' : (p.category === 'necklaces' ? 'necklace' : p.category),
        subCategory: p.subCategory || null,
        subCategoryName: p.subCategory || null,
        stoneShape: p.specifications?.stone_shape || pickStoneShape(p),
        weightDetails: p.weightDetails || p.specifications?.weightDetails || null,
        minPrice: p.price || 0,
        maxPrice: p.price || 0,
      }));
      lastCacheTime = Date.now();
      console.log(`[Cache] Fallback loaded ${allProductsCache.length} products from products.json`);
    }
  } catch (err) {
    console.error('[Cache] Fallback failed:', err.message);
  }
}

async function getCategories() {
  if (!categoriesCache) {
    await warmupCache();
  }
  return categoriesCache || [];
}

async function getProducts({ category, subCategory } = {}) {
  if (!allProductsCache) {
    await warmupCache();
  }

  let list = allProductsCache || [];

  if (subCategory && subCategory !== 'all') {
    return list.filter((p) => p.subCategory === subCategory);
  }

  if (category) {
    const normalizedCat =
      category === 'necklaces'
        ? 'necklace'
        : category === 'pendants'
        ? 'pendant'
        : category;
    return list.filter((p) => p.category === normalizedCat);
  }

  return list;
}

async function getProductBySlug(slug) {
  if (productsBySlugCache.has(slug)) {
    return productsBySlugCache.get(slug);
  }

  const product = await withDbRetry(() =>
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: { parent: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: true,
      },
    })
  );

  if (!product) return null;

  let weightDetails = null;
  if (product.variants?.[0]?.specifications) {
    try {
      const specs =
        typeof product.variants[0].specifications === 'string'
          ? JSON.parse(product.variants[0].specifications)
          : product.variants[0].specifications;
      weightDetails = specs.weightDetails || null;
    } catch (e) {
      // ignore
    }
  }

  const detailedProduct = {
    ...product,
    weightDetails,
  };

  productsBySlugCache.set(slug, detailedProduct);
  return detailedProduct;
}

function invalidateCache() {
  allProductsCache = null;
  categoriesCache = null;
  productsBySlugCache.clear();
  lastCacheTime = 0;
  return warmupCache(true);
}

module.exports = {
  warmupCache,
  getCategories,
  getProducts,
  getProductBySlug,
  invalidateCache,
};
