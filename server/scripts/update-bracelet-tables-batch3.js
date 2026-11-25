const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The final batch of bracelet tables from the user's uploaded images
const tableDataBySlug = {
  'pjbr-520-rd-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['2.00mm', '1.50', '3', '7.2', '8.37', '10.02', '13.07'],
      ['2.50mm', '2.68', '6', '8.2', '9.53', '11.41', '14.88'],
      ['3.00mm', '3.92', '10', '10.2', '11.86', '14.19', '18.51'],
      ['3.50mm', '5.35', '15', '11.2', '13.02', '15.58', '20.33'],
      ['3.80mm', '7.20', '20', '12.3', '14.30', '17.11', '22.32'],
      ['4.00mm', '7.60', '25', '13.2', '15.35', '18.36', '23.96'],
    ],
  },
  'pjbr-521-across-em': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2x3mm', '8.25', '25', '9.2', '10.70', '12.80', '16.70'],
      ['4X2.8', '6.20', '20', '8.9', '10.35', '12.38', '16.15'],
      ['3.5X2.5', '5.55', '15', '7.7', '8.95', '10.71', '13.98'],
      ['3X2', '4.10', '10', '6.4', '7.44', '8.90', '11.62'],
    ],
  },
  'pjbr-521-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2x3mm', '6.75', '25', '7.3', '8.49', '10.15', '13.25'],
      ['4X2.8', '5.60', '20', '7.4', '8.60', '10.29', '13.43'],
      ['3.5X2.5', '4.65', '15', '6.2', '7.21', '8.62', '11.25'],
      ['3X2', '3.70', '10', '5.2', '6.05', '7.23', '9.44'],
    ],
  },
  'pjbr-522-across-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '8.10', '25', '12', '13.95', '16.69', '21.78'],
      ['4.7X3.4', '6.25', '20', '11.1', '12.90', '15.44', '20.15'],
      ['4.3X3.0', '6.00', '15', '10.7', '12.44', '14.88', '19.42'],
      ['3.7X2.7', '5.10', '10', '9.1', '10.58', '12.66', '16.52'],
    ],
  },
  'pjbr-523-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5x3.5mm', '6.00', '25', '9.5', '11.04', '13.21', '17.24'],
      ['5X3.2', '5.40', '20', '8.2', '9.53', '11.41', '14.88'],
      ['4.6X3.0', '4.65', '15', '7.5', '8.72', '10.43', '13.61'],
      ['4X2.6', '3.10', '10', '6.3', '7.32', '8.76', '11.43'],
    ],
  },
  'pjbr-524-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['2.00mm', '1.30', '3', '6', '6.98', '8.35', '10.89'],
      ['2.50mm', '2.50', '6', '7.3', '8.49', '10.15', '13.25'],
      ['3.00mm', '3.80', '10', '9', '10.46', '12.52', '16.34'],
      ['3.50mm', '5.00', '15', '9.8', '11.39', '13.63', '17.79'],
      ['3.80mm', '6.80', '20', '11', '12.79', '15.30', '19.97'],
      ['4.00mm', '7.30', '25', '11.8', '13.72', '16.41', '21.42'],
    ],
  },
  'pjbr-525-mlt': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['Multi-Shape', '2.29', '5', '6.9', '8.02', '9.60', '12.52'],
    ],
  },
  'pjbr-520-across-em-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2X3.0', '7.50', '25', '11.4', '13.25', '15.86', '20.69'],
      ['4X2.8', '6.60', '20', '10.1', '11.74', '14.05', '18.33'],
      ['3.5X2.5', '5.70', '15', '8.6', '10.00', '11.96', '15.61'],
      ['3X2', '4.60', '10', '7.9', '9.18', '10.99', '14.34'],
    ],
  },
};

async function updateBraceletsBatch3() {
  console.log('1. Updating server/data/products.json...');
  for (const item of products) {
    if (tableDataBySlug[item.slug]) {
      const data = tableDataBySlug[item.slug];
      const weightDetails = {
        type: data.type,
        title: data.title,
        headers: data.headers,
        rows: data.rows,
      };

      item.weightDetails = weightDetails;
      if (!item.specifications) item.specifications = {};
      item.specifications.weightDetails = weightDetails;

      console.log(`Updated JSON for ${item.name} (${item.slug})`);
    }
  }

  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  console.log('Saved products.json successfully.');

  console.log('\n2. Updating Neon PostgreSQL Database...');
  for (const [slug, data] of Object.entries(tableDataBySlug)) {
    const weightDetails = {
      type: data.type,
      title: data.title,
      headers: data.headers,
      rows: data.rows,
    };

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

  console.log('All Bracelet Batch 3 tables successfully updated in JSON & DB!');
}

updateBraceletsBatch3()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
