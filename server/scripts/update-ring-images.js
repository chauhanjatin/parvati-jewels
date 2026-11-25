const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const RING_DIR = path.resolve('public/assets/dummy-data/ring');

function getFileNumber(filename) {
  const m = filename.match(/\d+/);
  return m ? parseInt(m[0], 10) : 999;
}

// Normalize a string for matching: lowercase, strip non-alphanumeric except hyphen
function normalizeKey(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('Reading ring directories from:', RING_DIR);
  const subdirs = fs.readdirSync(RING_DIR);
  
  // Build a map of normalized slug/name -> { subDir, prodDir, files }
  const folderMap = new Map();
  for (const sub of subdirs) {
    const subPath = path.join(RING_DIR, sub);
    if (!fs.statSync(subPath).isDirectory()) continue;
    const prods = fs.readdirSync(subPath);
    for (const prod of prods) {
      const prodPath = path.join(subPath, prod);
      if (!fs.statSync(prodPath).isDirectory()) continue;
      const files = fs.readdirSync(prodPath).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
      files.sort((a, b) => getFileNumber(a) - getFileNumber(b));
      
      const normKey = normalizeKey(prod);
      folderMap.set(normKey, {
        subDir: sub,
        prodDir: prod,
        files: files
      });
    }
  }

  console.log(`Indexed ${folderMap.size} product folders.`);

  // Load products.json
  const jsonPath = path.resolve('server/data/products.json');
  const allProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let matchedCount = 0;
  let updatedImagesCount = 0;
  const updatesForDb = [];

  for (const p of allProducts) {
    if (p.category !== 'rings' && p.category !== 'ring') continue;

    const normSlug = normalizeKey(p.slug);
    const normName = normalizeKey(p.name);

    let match = folderMap.get(normSlug) || folderMap.get(normName);
    
    // Special handling if slug had different suffix or format
    if (!match) {
      for (const [key, val] of folderMap.entries()) {
        if (normSlug.includes(key) || key.includes(normSlug)) {
          match = val;
          break;
        }
      }
    }

    if (match) {
      matchedCount++;
      if (match.files.length > 0) {
        const primaryImage = `/assets/dummy-data/ring/${match.subDir}/${match.prodDir}/${match.files[0]}`;
        const additionalImages = match.files.slice(1).map(f => `/assets/dummy-data/ring/${match.subDir}/${match.prodDir}/${f}`);

        p.image = primaryImage;
        p.additionalImages = additionalImages;
        updatedImagesCount++;

        updatesForDb.push({
          id: p.id,
          slug: p.slug,
          name: p.name,
          primaryImage,
          additionalImages,
        });

        console.log(`[MATCH] ${p.name} (${p.slug})`);
        console.log(`   Primary: ${primaryImage}`);
        console.log(`   Additional (${additionalImages.length}):`, additionalImages);
      } else {
        console.log(`[EMPTY FOLDER] ${p.name} (${p.slug}) -> Folder ${match.prodDir} has 0 images.`);
      }
    } else {
      console.warn(`[NO MATCH] ${p.name} (${p.slug})`);
    }
  }

  console.log(`\nMatched ${matchedCount} / 57 rings.`);
  console.log(`Updated images for ${updatedImagesCount} rings with real assets.`);

  // Write updated products.json
  fs.writeFileSync(jsonPath, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log('Saved updated server/data/products.json.');

  // Now update database
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
    } catch (err) {
      console.error(`[DB ERROR] Error updating ${item.slug}:`, err.message);
    }
  }

  console.log(`\nSuccessfully updated ${dbSuccessCount} rings in database.`);
}

run()
  .catch((e) => {
    console.error('Update script failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
