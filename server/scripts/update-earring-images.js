const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');
const { invalidateCache } = require('../lib/catalogCache');

const EARRING_DIR = path.resolve('public/assets/dummy-data/earring');

function getFileNumber(filename) {
  const m = filename.match(/\d+/);
  return m ? parseInt(m[0], 10) : 999;
}

function normalizeKey(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function relaxedMatch(slug, key) {
  const s = normalizeKey(slug).replace(/0/g, 'o').replace(/bug/g, 'bag');
  const k = normalizeKey(key).replace(/0/g, 'o').replace(/bug/g, 'bag');
  return s === k;
}

async function run() {
  console.log('Reading earring directories from:', EARRING_DIR);
  const subdirs = fs.readdirSync(EARRING_DIR);

  const folderMap = new Map();
  for (const sub of subdirs) {
    const subPath = path.join(EARRING_DIR, sub);
    if (!fs.statSync(subPath).isDirectory()) continue;
    const prods = fs.readdirSync(subPath);
    for (const prod of prods) {
      const prodPath = path.join(subPath, prod);
      if (!fs.statSync(prodPath).isDirectory()) continue;
      const files = fs.readdirSync(prodPath).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
      files.sort((a, b) => getFileNumber(a) - getFileNumber(b));

      folderMap.set(normalizeKey(prod), {
        subDir: sub,
        prodDir: prod,
        files
      });
    }
  }

  console.log(`Indexed ${folderMap.size} earring product folders.`);

  // Load products.json
  const jsonPath = path.resolve('server/data/products.json');
  const allProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let matchedWithImages = 0;
  let matchedWithoutImages = 0;
  let unmatchedCount = 0;
  const updatesForDb = [];

  for (const p of allProducts) {
    if (p.category !== 'earring' && p.category !== 'earrings') continue;

    const normSlug = normalizeKey(p.slug);
    const normName = normalizeKey(p.name);

    let match = folderMap.get(normSlug) || folderMap.get(normName);

    if (!match) {
      for (const [key, val] of folderMap.entries()) {
        if (relaxedMatch(p.slug, key) || relaxedMatch(p.name, key)) {
          match = val;
          break;
        }
      }
    }

    if (!match) {
      for (const [key, val] of folderMap.entries()) {
        if (normSlug.includes(key) || key.includes(normSlug)) {
          match = val;
          break;
        }
      }
    }

    if (match) {
      if (match.files.length > 0) {
        matchedWithImages++;
        const primaryImage = `/assets/dummy-data/earring/${match.subDir}/${match.prodDir}/${match.files[0]}`;
        const additionalImages = match.files.slice(1).map(
          f => `/assets/dummy-data/earring/${match.subDir}/${match.prodDir}/${f}`
        );

        p.image = primaryImage;
        p.additionalImages = additionalImages;

        updatesForDb.push({
          id: p.id,
          slug: p.slug,
          name: p.name,
          primaryImage,
          additionalImages,
        });

        console.log(`[MATCH - REAL IMAGES] ${p.name} (${p.slug})`);
        console.log(`   Primary: ${primaryImage}`);
        console.log(`   Additional (${additionalImages.length}):`, additionalImages);
      } else {
        matchedWithoutImages++;
        // Normalize fallback images to standard format
        if (p.image && p.image.startsWith('../assets/')) {
          p.image = p.image.replace('../assets/', '/assets/');
        }
        if (Array.isArray(p.additionalImages)) {
          p.additionalImages = p.additionalImages.map(img =>
            img.startsWith('../assets/') ? img.replace('../assets/', '/assets/') : img
          );
        }
        console.log(`[EMPTY FOLDER] ${p.name} (${p.slug}) -> Folder ${match.subDir}/${match.prodDir} currently has 0 images.`);
      }
    } else {
      unmatchedCount++;
      console.warn(`[NO MATCH] ${p.name} (${p.slug})`);
    }
  }

  console.log(`\nMatched with real images: ${matchedWithImages}`);
  console.log(`Matched with empty folder: ${matchedWithoutImages}`);
  console.log(`Unmatched: ${unmatchedCount}`);

  // Save updated products.json
  fs.writeFileSync(jsonPath, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log('Saved updated server/data/products.json.');

  // Update Neon PostgreSQL Database
  console.log('\nUpdating Neon PostgreSQL Database (ProductImage table)...');
  let dbSuccessCount = 0;

  for (const item of updatesForDb) {
    try {
      const dbProduct = await withDbRetry(() =>
        prisma.product.findUnique({ where: { slug: item.slug } })
      );

      if (!dbProduct) {
        console.warn(`[DB SKIP] Not found in DB: ${item.slug}`);
        continue;
      }

      // Delete old product images
      await withDbRetry(() =>
        prisma.productImage.deleteMany({ where: { productId: dbProduct.id } })
      );

      // Create primary image
      await withDbRetry(() =>
        prisma.productImage.create({
          data: {
            productId: dbProduct.id,
            imageUrl: item.primaryImage,
            sortOrder: 1,
            isPrimary: true,
            altText: item.name,
          },
        })
      );

      // Create additional images
      for (let i = 0; i < item.additionalImages.length; i++) {
        await withDbRetry(() =>
          prisma.productImage.create({
            data: {
              productId: dbProduct.id,
              imageUrl: item.additionalImages[i],
              sortOrder: i + 2,
              isPrimary: false,
              altText: `${item.name} - ${i + 2}`,
            },
          })
        );
      }

      dbSuccessCount++;
      console.log(`[DB OK] Updated images for ${item.name} in DB.`);
    } catch (err) {
      console.error(`[DB ERROR] Error updating ${item.slug}:`, err.message);
    }
  }

  console.log(`\nSuccessfully updated ${dbSuccessCount} earrings in Neon database.`);

  // Invalidate cache
  try {
    invalidateCache();
    console.log('Catalog cache invalidated.');
  } catch (e) {
    console.log('Cache invalidation note:', e.message);
  }
}

run()
  .catch((e) => {
    console.error('Update script failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
