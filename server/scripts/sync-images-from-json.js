/**
 * Update product images from products.json without wiping the catalog.
 * Usage: node scripts/sync-images-from-json.js [rings|earrings|all]
 */
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const SRC_DUMMY = path.join(__dirname, '..', '..', 'src', 'assets', 'dummy-data');
const PUBLIC_DUMMY = path.join(__dirname, '..', '..', 'public', 'assets', 'dummy-data');

const JSON_CATEGORY_TO_SLUG = {
  rings: 'rings',
  earrings: 'earrings',
  bracelets: 'bracelets',
  necklaces: 'necklace',
  pendants: 'pendant',
  diamonds: 'diamonds',
};

function resolveImage(rawPath) {
  let raw = (rawPath || '').trim().replace(/\\/g, '/');
  if (raw.startsWith('../assets/')) {
    raw = raw.replace('../assets/', '/assets/');
  }
  if (raw.includes('dummy-data/')) {
    const relFromDummy = raw.slice(raw.indexOf('dummy-data/') + 'dummy-data/'.length);
    const src = path.join(SRC_DUMMY, relFromDummy);
    const dest = path.join(PUBLIC_DUMMY, relFromDummy);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
    return `/assets/dummy-data/${relFromDummy}`;
  }
  if (raw.startsWith('/products/') || raw.startsWith('/assets/')) {
    return raw;
  }
  return raw;
}

const CLI_FILTER_TO_DB_SLUG = {
  rings: 'rings',
  earrings: 'earrings',
  bracelets: 'bracelets',
  necklaces: 'necklace',
  necklace: 'necklace',
  pendants: 'pendant',
  pendant: 'pendant',
  diamonds: 'diamonds',
};

async function main() {
  const filter = process.argv[2] || 'all';
  const allowed =
    filter === 'all'
      ? null
      : new Set([CLI_FILTER_TO_DB_SLUG[filter] || filter]);

  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'),
  );

  let updated = 0;
  for (const item of products) {
    const catSlug = JSON_CATEGORY_TO_SLUG[item.category];
    if (allowed && !allowed.has(catSlug)) continue;

    const imageUrl = resolveImage(item.image);
    const product = await withDbRetry(() =>
      prisma.product.findUnique({ where: { slug: item.slug } })
    );
    if (!product) {
      console.warn(`Skip (not in DB): ${item.slug}`);
      continue;
    }

    await withDbRetry(() =>
      prisma.productImage.deleteMany({ where: { productId: product.id } })
    );

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
        const addImgUrl = resolveImage(item.additionalImages[i]);
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

    console.log(`${item.slug} → ${imageUrl}`);
    updated += 1;
  }
  console.log(`Updated ${updated} product image(s).`);
}

main()
  .catch((e) => {
    console.error('Sync images error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
