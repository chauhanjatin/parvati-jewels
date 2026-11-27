const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');
const { invalidateCache } = require('../lib/catalogCache');

const SRC_BRACELET_DIR = path.join(__dirname, '..', '..', 'src', 'assets', 'dummy-data', 'bracelet');
const PUB_BRACELET_DIR = path.join(__dirname, '..', '..', 'public', 'assets', 'dummy-data', 'bracelet');
const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json');

// Exact mapping for any folder name that doesn't simply match by slugify
const SPECIAL_FOLDER_TO_SLUG = {
  'PJBR-205-Mix-Oval-Round': 'pjbr-205-mix-oval',
  'PJBR-500-Round-(CROWN)': 'pjbr-500-round',
  'PJBR-516-MLT RD-PR-OVL-EM-MQ-CS': 'pjbr-516-mlt-rd-pr',
};

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
}

async function syncBraceletImages() {
  console.log('[Sync Bracelets] Starting image sync...');

  // Ensure public folder exists
  fs.mkdirSync(PUB_BRACELET_DIR, { recursive: true });

  const productsJson = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
  const braceletProducts = productsJson.filter(p => p.category === 'bracelets');

  const folders = fs.readdirSync(SRC_BRACELET_DIR);
  console.log(`Found ${folders.length} folders in src/assets/dummy-data/bracelet and ${braceletProducts.length} bracelet products in products.json`);

  let updatedCount = 0;

  for (const folder of folders) {
    const srcFolder = path.join(SRC_BRACELET_DIR, folder);
    if (!fs.statSync(srcFolder).isDirectory()) continue;

    const pubFolder = path.join(PUB_BRACELET_DIR, folder);
    fs.mkdirSync(pubFolder, { recursive: true });

    // Copy all files from src to public
    const files = fs.readdirSync(srcFolder)
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    for (const f of files) {
      const srcFile = path.join(srcFolder, f);
      const pubFile = path.join(pubFolder, f);
      fs.copyFileSync(srcFile, pubFile);
    }

    // Match with product in products.json
    let targetSlug = SPECIAL_FOLDER_TO_SLUG[folder];
    if (!targetSlug) {
      targetSlug = slugify(folder);
    }

    let prod = braceletProducts.find(p => p.slug === targetSlug);
    if (!prod) {
      prod = braceletProducts.find(p => p.slug.replace(/-/g, '') === targetSlug.replace(/-/g, ''));
    }
    if (!prod) {
      prod = braceletProducts.find(p => p.name.toLowerCase() === folder.toLowerCase());
    }

    if (!prod) {
      console.warn(`[Sync Bracelets] No matching product found for folder: "${folder}" (slug: ${targetSlug})`);
      continue;
    }

    if (files.length === 0) {
      console.log(`[Sync Bracelets] Folder "${folder}" has no images yet. Keeping existing placeholder for ${prod.slug}`);
      continue;
    }

    // Assign images
    const primaryImg = `/assets/dummy-data/bracelet/${folder}/${files[0]}`;
    const additionalImgs = files.slice(1).map(f => `/assets/dummy-data/bracelet/${folder}/${f}`);

    // Update products.json
    prod.image = primaryImg;
    prod.additionalImages = additionalImgs;

    // Update database
    const dbProduct = await withDbRetry(() =>
      prisma.product.findUnique({
        where: { slug: prod.slug }
      })
    );

    if (dbProduct) {
      // Clear old images
      await withDbRetry(() =>
        prisma.productImage.deleteMany({
          where: { productId: dbProduct.id }
        })
      );

      // Create primary image
      await withDbRetry(() =>
        prisma.productImage.create({
          data: {
            productId: dbProduct.id,
            imageUrl: primaryImg,
            isPrimary: true,
            sortOrder: 1,
            altText: prod.name
          }
        })
      );

      // Create additional images
      for (let i = 0; i < additionalImgs.length; i++) {
        await withDbRetry(() =>
          prisma.productImage.create({
            data: {
              productId: dbProduct.id,
              imageUrl: additionalImgs[i],
              isPrimary: false,
              sortOrder: i + 2,
              altText: `${prod.name} - ${i + 2}`
            }
          })
        );
      }
      console.log(`[Sync Bracelets] Updated DB & JSON for "${prod.slug}" -> ${primaryImg} (+${additionalImgs.length} add'l)`);
    } else {
      console.log(`[Sync Bracelets] Updated JSON only (not in DB) for "${prod.slug}" -> ${primaryImg}`);
    }

    updatedCount++;
  }

  // Save updated products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(productsJson, null, 2), 'utf8');
  console.log(`[Sync Bracelets] Successfully saved updated ${PRODUCTS_JSON_PATH}`);

  // Invalidate cache
  try {
    await invalidateCache();
    console.log('[Sync Bracelets] Catalog cache invalidated successfully.');
  } catch (err) {
    console.warn('[Sync Bracelets] Failed to invalidate cache directly:', err.message);
  }

  console.log(`[Sync Bracelets] Done! Updated images for ${updatedCount} bracelet(s).`);
}

syncBraceletImages()
  .catch((err) => {
    console.error('[Sync Bracelets] Fatal error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
