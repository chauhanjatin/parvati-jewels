const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 2 exact tables from the user's images
const tableDataBySlug = {
  'pjr-363-pe-em': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['7x4.5/5.5x3.8mm', '0.50', '2.5', '2.91', '3.48', '4.54'],
      ['8x5/6x4.2mm', '0.75', '2.7', '3.14', '3.76', '4.90'],
      ['9x5.5/7x5mm', '1.00', '2.8', '3.26', '3.89', '5.08'],
      ['10.2x6.5/7.8x5.8mm', '1.50', '3.4', '3.95', '4.73', '6.17'],
      ['11.2x7.1/8.5x6mm', '2.00', '4.1', '4.77', '5.70', '7.44'],
    ],
  },
  'pjr-371-pe-em': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['7x4.5/5.5x3.8mm', '0.50', '2.4', '2.79', '3.34', '4.36'],
      ['8x5/6x4.2mm', '0.75', '2.8', '3.26', '3.89', '5.08'],
      ['9x5.5/7x5mm', '1.00', '3.2', '3.72', '4.45', '5.81'],
      ['10.2x6.5/7.8x5.8mm', '1.50', '4', '4.65', '5.56', '7.26'],
      ['11.2x7.1/8.5x6mm', '2.00', '4.2', '4.88', '5.84', '7.62'],
    ],
  },
};

async function updateToiMoiRings() {
  console.log('1. Updating server/data/products.json...');
  for (const item of products) {
    if (tableDataBySlug[item.slug]) {
      const newWeightDetails = tableDataBySlug[item.slug];
      item.weightDetails = newWeightDetails;
      if (!item.specifications) item.specifications = {};
      item.specifications.weightDetails = newWeightDetails;
      console.log(`Updated JSON for ${item.name} (${item.slug})`);
    }
  }

  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  console.log('Saved products.json successfully.');

  console.log('\n2. Updating Neon PostgreSQL Database...');
  for (const [slug, weightDetails] of Object.entries(tableDataBySlug)) {
    const product = await withDbRetry(() =>
      prisma.product.findUnique({
        where: { slug },
        include: { variants: true },
      })
    );

    if (!product) {
      console.warn(`Product not found in DB with slug: ${slug}`);
      continue;
    }

    for (const variant of product.variants) {
      let specs = {};
      if (variant.specifications) {
        try {
          specs = typeof variant.specifications === 'string'
            ? JSON.parse(variant.specifications)
            : variant.specifications;
        } catch (e) {
          specs = {};
        }
      }
      specs.weightDetails = weightDetails;

      await withDbRetry(() =>
        prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            specifications: JSON.stringify(specs),
          },
        })
      );
      console.log(`Updated DB variant for ${product.name} (variantId: ${variant.id})`);
    }
  }

  console.log('\n3. Refreshing in-memory server cache...');
  try {
    const http = require('http');
    const req = http.request('http://localhost:5055/api/cache/refresh', { method: 'POST' }, (res) => {
      console.log(`Cache refresh responded with status: ${res.statusCode}`);
    });
    req.on('error', (e) => console.log('Cache refresh request note:', e.message));
    req.end();
  } catch (err) {
    console.log('Note on cache refresh:', err.message);
  }

  console.log('All 2 Toi Moi Ring tables successfully updated in JSON & DB!');
}

updateToiMoiRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
