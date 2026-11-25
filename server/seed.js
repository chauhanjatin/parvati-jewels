const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { prisma, withDbRetry, warmupDatabase } = require('./lib/prisma');
const { enrichProductRecord } = require('./lib/enrichProductRecord');

const JSON_CATEGORY_TO_SLUG = {
  rings: 'rings',
  earrings: 'earrings',
  bracelets: 'bracelets',
  necklaces: 'necklace',
  pendants: 'pendant',
  diamonds: 'diamonds',
};

const CATEGORY_DISPLAY_NAMES = {
  rings: 'Rings',
  earrings: 'Earrings',
  bracelets: 'Bracelets',
  necklace: 'Necklaces',
  pendant: 'Pendants',
  diamonds: 'Diamonds',
};

const SUB_CATEGORIES = {
  rings: [
    { slug: '3-stone-ring', name: '3 Stone Ring' },
    { slug: 'art-deco', name: 'Art Deco' },
    { slug: 'color-stone-ring', name: 'Color Stone Ring' },
    { slug: 'et', name: 'ET (Eternity Band)' },
    { slug: 'halo-ring', name: 'Halo Ring' },
    { slug: 'plain-solitaire-ring', name: 'Plain Solitaire Ring' },
    { slug: 'side-stone-ring', name: 'Side Stone Ring' },
    { slug: 'toi-moi-ring', name: 'Toi Moi Ring' },
  ],
  earrings: [
    { slug: 'halo-earring', name: 'Halo Earring' },
    { slug: 'hoop-earring', name: 'Hoop Earring' },
    { slug: 'single-stone-earring', name: 'Single Stone Earring' },
  ],
  pendant: [
    { slug: 'cross-pendant', name: 'Cross Pendant' },
    { slug: 'halo-pendant', name: 'Halo Pendant' },
    { slug: 'single-stone-pendant', name: 'Single Stone Pendant' },
    { slug: 'two-stone-pendant', name: 'Two Stone Pendant' },
  ],
};

const PUBLIC_PRODUCTS = path.join(__dirname, '..', 'public', 'products');
const SRC_DUMMY_DATA = path.join(__dirname, '..', 'src', 'assets', 'dummy-data');
const PUBLIC_DUMMY_DATA = path.join(__dirname, '..', 'public', 'assets', 'dummy-data');

function loadProducts() {
  const filePath = path.join(__dirname, 'data', 'products.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function mapCategorySlug(jsonCategory) {
  const slug = JSON_CATEGORY_TO_SLUG[jsonCategory];
  if (!slug) {
    throw new Error(`Unknown category in JSON: ${jsonCategory}`);
  }
  return slug;
}

/** Served by Vite from public/products/… */
function localProductImageUrl(item) {
  const folder = mapCategorySlug(item.category);
  const jpg = path.join(PUBLIC_PRODUCTS, folder, `${item.slug}.jpg`);
  const png = path.join(PUBLIC_PRODUCTS, folder, `${item.slug}.png`);
  if (fs.existsSync(jpg)) {
    return `/products/${folder}/${item.slug}.jpg`;
  }
  if (fs.existsSync(png)) {
    return `/products/${folder}/${item.slug}.png`;
  }
  throw new Error(`No image file for ${item.slug} in public/products/${folder}/`);
}

/** JSON `image` may point at src/assets/dummy-data (copied to public on seed). */
function resolveProductImageUrl(item) {
  const raw = (item.image || '').trim().replace(/\\/g, '/');
  if (raw.includes('dummy-data/')) {
    const basename = path.basename(raw);
    const srcFile = path.join(SRC_DUMMY_DATA, basename);
    if (!fs.existsSync(srcFile)) {
      throw new Error(`Missing dummy-data image: ${srcFile}`);
    }
    fs.mkdirSync(PUBLIC_DUMMY_DATA, { recursive: true });
    fs.copyFileSync(srcFile, path.join(PUBLIC_DUMMY_DATA, basename));
    return `/assets/dummy-data/${basename}`;
  }
  if (raw.startsWith('/assets/') || raw.startsWith('/products/')) {
    return raw;
  }
  return localProductImageUrl(item);
}

async function clearCatalog() {
  await withDbRetry(() =>
    prisma.inquiry.updateMany({
      where: { productId: { not: null } },
      data: { productId: null },
    })
  );
  await withDbRetry(() => prisma.productImage.deleteMany({}));
  await withDbRetry(() => prisma.productVariant.deleteMany({}));
  await withDbRetry(() => prisma.product.deleteMany({}));
  await withDbRetry(() => prisma.category.deleteMany({}));
}

async function ensureCategories(categorySlugs) {
  const bySlug = {};
  for (const slug of categorySlugs) {
    const name = CATEGORY_DISPLAY_NAMES[slug] || slug;
    const category = await withDbRetry(() =>
      prisma.category.create({
        data: { name, slug },
      })
    );
    bySlug[slug] = category;
  }

  // Create subcategories linked to their parents
  for (const [parentSlug, subList] of Object.entries(SUB_CATEGORIES)) {
    const parent = bySlug[parentSlug];
    if (parent) {
      for (const sub of subList) {
        const subCategory = await withDbRetry(() =>
          prisma.category.create({
            data: {
              name: sub.name,
              slug: sub.slug,
              parentId: parent.id,
            },
          })
        );
        bySlug[sub.slug] = subCategory;
      }
    }
  }

  return bySlug;
}

async function upsertProduct(rawItem, categoryId) {
  const item = enrichProductRecord(rawItem);
  const sku = `${item.slug}-default`;
  const imageUrl = resolveProductImageUrl(item);

  const productPayload = {
    name: item.name,
    description: item.description,
    shortDescription: item.shortDescription,
    material: item.material,
    brand: item.brand,
    rating: item.rating,
    reviewCount: item.reviewCount,
    isBestseller: item.isBestseller,
    isFeatured: item.isFeatured,
    categoryId,
  };

  const product = await withDbRetry(() =>
    prisma.product.upsert({
      where: { slug: item.slug },
      update: productPayload,
      create: {
        slug: item.slug,
        ...productPayload,
      },
    })
  );

  await withDbRetry(() => prisma.productImage.deleteMany({ where: { productId: product.id } }));
  await withDbRetry(() =>
    prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl,
        sortOrder: 1,
        isPrimary: true,
        altText: item.name,
      },
    })
  );

  if (item.additionalImages && Array.isArray(item.additionalImages)) {
    for (let i = 0; i < item.additionalImages.length; i++) {
      const addImgRaw = { ...item, image: item.additionalImages[i] };
      const addImgUrl = resolveProductImageUrl(addImgRaw);
      await withDbRetry(() =>
        prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: addImgUrl,
            sortOrder: i + 2,
            isPrimary: false,
            altText: `${item.name} - ${i + 2}`,
          },
        })
      );
    }
  }

  const specifications = JSON.stringify(item.specifications);

  const variantPayload = {
    price: item.price,
    comparePrice: item.comparePrice,
    metal: item.metal,
    size: item.size,
    stock: item.stock,
    specifications,
  };

  await withDbRetry(() =>
    prisma.productVariant.upsert({
      where: { sku },
      update: variantPayload,
      create: {
        productId: product.id,
        sku,
        ...variantPayload,
      },
    })
  );
}

async function main() {
  console.log('Loading products from data/products.json...');
  const products = loadProducts();
  console.log(`Found ${products.length} products (dummy-data or public/products images).`);

  console.log('Clearing old catalog...');
  await warmupDatabase();
  await clearCatalog();

  const categorySlugs = [
    ...new Set(products.map((p) => mapCategorySlug(p.category))),
  ];
  console.log('Creating categories:', categorySlugs.join(', '));
  const categoriesBySlug = await ensureCategories(categorySlugs);

  console.log('Seeding products...');
  for (const item of products) {
    const catSlug = mapCategorySlug(item.category);
    const targetCatId = (item.subCategory && categoriesBySlug[item.subCategory])
      ? categoriesBySlug[item.subCategory].id
      : categoriesBySlug[catSlug].id;
    await upsertProduct(item, targetCatId);
  }

  console.log(`Seeding finished. ${products.length} products imported.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
