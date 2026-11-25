const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 3 exact tables from the user's images
const tableDataBySlug = {
  'pjr-506-marquise': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['8x4mm', '0.5', '0.18', '2.83', '3.29', '3.94', '5.14'],
      ['9.5X4.7mm', '0.75', '0.18', '3.2', '3.72', '4.45', '5.81'],
      ['11.0x5.1mm', '1', '0.24', '3.7', '4.30', '5.15', '6.72'],
      ['11.7x6mm', '1.5', '0.48', '3.8', '4.42', '5.29', '6.90'],
      ['12.8x6.7mm', '2', '0.48', '3.9', '4.53', '5.42', '7.08'],
    ],
  },
  'pjr-548-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6X4.2mm', '0.75', '0.36', '3.1', '3.60', '4.31', '5.63'],
      ['7X5mm', '1', '0.4', '3.2', '3.72', '4.45', '5.81'],
      ['7.8X5.8mm', '1.5', '0.42', '3.3', '3.50', '4.59', '5.99'],
      ['8.5x6mm', '2', '0.42', '3.5', '3.60', '4.87', '6.35'],
    ],
  },
  'pjr-631-round-3stone': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.00mm', '0.75', '2.58', '3.00', '3.59', '4.68'],
      ['5.00mm', '1.50', '2.65', '3.08', '3.69', '4.81'],
      ['5.80mm', '2.25', '3', '3.49', '4.17', '5.45'],
      ['6.50mm', '3.00', '3.5', '4.07', '4.87', '6.35'],
    ],
  },
};

async function update3StoneRings() {
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

    // Update variant specifications
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

  console.log('All 3 Stone Ring tables successfully updated in JSON & DB!');
}

update3StoneRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
