const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 8 exact tables from the user's images
const tableDataBySlug = {
  'pjr-516-marquise': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['8x4mm', '0.5', '0.12', '4.15', '4.82', '5.77', '7.53'],
      ['9.5x4.7mm', '0.75', '0.12', '4.3', '5.00', '5.98', '7.80'],
      ['11x5.1mm', '1.0', '0.12', '4.6', '5.35', '6.40', '8.35'],
      ['11.7x5.6mm', '1.25', '0.12', '4.8', '5.58', '6.68', '8.71'],
      ['11.7x6mm', '1.5', '0.12', '4.8', '5.58', '6.68', '8.71'],
    ],
  },
  'pjr-518-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['7x4.5mm', '0.50', '0.035', '4.55', '5.29', '6.33', '8.26'],
      ['8x5mm', '0.75', '0.035', '4.65', '5.41', '6.47', '8.44'],
      ['9x5.5mm', '1.00', '0.035', '4.75', '5.52', '6.61', '8.62'],
      ['9.8x6.1mm', '1.25', '0.035', '4.85', '5.64', '6.75', '8.80'],
      ['10.2x6.5mm', '1.50', '0.035', '4.95', '5.75', '6.89', '8.98'],
    ],
  },
  'pjr-520-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5x3.8mm', '0.5', '0.288', '2.86', '3.33', '3.98', '5.19'],
      ['6x4.2mm', '0.75', '0.288', '2.9', '3.37', '4.03', '5.26'],
      ['7x5mm', '1', '0.288', '3.2', '3.72', '4.45', '5.81'],
      ['7.3x5.3mm', '1.25', '0.288', '3.3', '3.84', '4.59', '5.99'],
      ['7.8x5.8mm', '1.5', '0.288', '3.41', '3.96', '4.74', '6.19'],
    ],
  },
  'pjr-536-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.80mm', '0.75', '0.588', '3.03', '3.52', '4.21', '5.50'],
      ['6.40mm', '1.00', '0.588', '3.22', '3.74', '4.48', '5.84'],
      ['7.40mm', '1.50', '0.588', '3.38', '3.93', '4.70', '6.13'],
      ['8.20mm', '2.00', '0.588', '3.42', '3.98', '4.76', '6.21'],
    ],
  },
  'pjr-547-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.50x4.50mm', '0.5', '0.52', '2.07', '2.41', '2.88', '3.76'],
      ['8.5x5.7mm', '1', '0.52', '2.34', '2.72', '3.25', '4.25'],
      ['9.3x6.5mm', '1.5', '0.52', '2.51', '2.92', '3.49', '4.56'],
      ['9.3x6.7mm', '1.75', '0.52', '2.57', '2.99', '3.57', '4.66'],
      ['10.2x7.2mm', '2', '0.52', '2.59', '3.01', '3.60', '4.70'],
      ['11x7.7mm', '2.5', '0.52', '3.15', '3.66', '4.38', '5.72'],
    ],
  },
  'pjr-584-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.5x4.5mm', '0.5', '0.2', '2.14', '2.49', '2.98', '3.88'],
      ['7x5mm', '0.75', '0.2', '2.25', '2.62', '3.13', '4.08'],
      ['8.5x5.7mm', '1', '0.2', '2.42', '2.81', '3.37', '4.39'],
      ['8.6x6.1mm', '1.25', '0.2', '2.43', '2.83', '3.38', '4.41'],
      ['9.3x6.5mm', '1.5', '0.2', '2.54', '2.95', '3.53', '4.61'],
    ],
  },
  'pjr-628-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.50', '0.13', '3.9', '4.53', '5.42', '7.08'],
      ['5.80mm', '0.75', '0.13', '4', '4.65', '5.56', '7.26'],
      ['6.40mm', '1.00', '0.13', '4.2', '4.88', '5.84', '7.62'],
      ['7.40mm', '1.50', '0.13', '4.5', '5.23', '6.26', '8.17'],
      ['8.20mm', '2.00', '0.13', '4.8', '5.58', '6.68', '8.71'],
    ],
  },
  'pjr-722-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.5', '0.219', '2.12', '2.46', '2.95', '3.85'],
      ['5.80mm', '0.75', '0.219', '2.12', '2.46', '2.95', '3.85'],
      ['6.40mm', '1', '0.219', '2.27', '2.64', '3.16', '4.12'],
      ['7.00mm', '1.25', '0.219', '2.36', '2.74', '3.28', '4.28'],
      ['7.40mm', '1.5', '0.219', '2.56', '2.98', '3.56', '4.65'],
    ],
  },
};

async function updateSideStoneRings() {
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

  console.log('All 8 Side Stone Ring tables successfully updated in JSON & DB!');
}

updateSideStoneRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
