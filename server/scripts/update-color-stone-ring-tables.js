const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 6 exact tables from the user's images
const tableDataBySlug = {
  'pjr-314-pe-em-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['7x4.5/5.5x3.8mm', '0.50', '0.12', '5.1', '5.93', '7.09', '9.26'],
      ['8x5/6x4.2mm', '0.75', '0.22', '5.9', '6.86', '8.21', '10.71'],
      ['9x5.5/7x5mm', '1.00', '0.18', '6.4', '7.44', '8.90', '11.62'],
      ['9.8x6.1/7.3x5.3mm', '1.25', '0.18', '7', '8.14', '9.74', '12.71'],
    ],
  },
  'pjr-315-mq-ov-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)(MQ/OV)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['8x4/6.5x4.5mm', '0.5', '4.6', '5.35', '6.40', '8.35'],
      ['9.5x4.7/7x5mm', '0.75', '5.1', '5.93', '7.09', '9.26'],
      ['11x5.1/8.5x5.7mm', '1', '5.5', '6.39', '7.65', '9.98'],
      ['11.7x5.6/8.6x6.1mm', '1.25', '6.5', '7.56', '9.04', '11.80'],
    ],
  },
  'pjr-363-ov-pe-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.5x4.5/7x4.5mm', '0.50', '2.5', '2.91', '3.48', '4.54'],
      ['7x5/8x5mm', '0.75', '2.7', '3.14', '3.76', '4.90'],
      ['8.5x5.7/9x5.5mm', '1.00', '2.8', '3.26', '3.89', '5.08'],
      ['8.6x6.1/9.8x6.1mm', '1.25', '3.4', '3.95', '4.73', '6.17'],
    ],
  },
  'pjr-371-ov-pe-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.5x4.5/7x4.5mm', '0.50', '2.3', '2.67', '3.20', '4.17'],
      ['7x5/8x5mm', '0.75', '2.7', '3.14', '3.76', '4.90'],
      ['8.5x5.7/9x5.5mm', '1.00', '3.2', '3.72', '4.45', '5.81'],
      ['8.6x6.1/9.8x6.1mm', '1.25', '4.1', '4.77', '5.70', '7.44'],
    ],
  },
  'pjr-551-emerald-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6x4.2mm', '0.75', '3.9', '4.53', '5.42', '7.08'],
      ['7x5mm', '1.00', '4.35', '5.06', '6.05', '7.90'],
      ['7.3x5.3mm', '1.25', '4.5', '5.23', '6.26', '8.17'],
      ['7.8x5.8mm', '1.5', '4.8', '5.58', '6.68', '8.71'],
      ['8.5x6mm', '2.00', '5.3', '6.16', '7.37', '9.62'],
    ],
  },
  'pjr-553-marquise-cs': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['9.5x4.7mm', '0.75', '3.95', '4.59', '5.49', '7.17'],
      ['11x5.1mm', '1.00', '4.35', '5.06', '6.05', '7.90'],
      ['11.7x5.6mm', '1.25', '4.75', '5.52', '6.61', '8.62'],
      ['11.7x6mm', '1.5', '5.2', '6.05', '7.23', '9.44'],
      ['12.8x6.7mm', '2.00', '5.5', '6.39', '7.65', '9.98'],
    ],
  },
};

async function updateColorStoneRings() {
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

  console.log('All 6 Color Stone Ring tables successfully updated in JSON & DB!');
}

updateColorStoneRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
