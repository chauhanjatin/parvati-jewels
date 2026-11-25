const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 15 exact tables from the user's second batch of uploaded images
const tableDataBySlug = {
  'pjbr-501-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.30mm', '1.02', '1', '5.12', '5.95', '7.12', '9.29'],
      ['1.50mm', '1.53', '1.5', '5.89', '6.85', '8.19', '10.69'],
      ['1.80mm', '2.23', '2.5', '6.21', '7.22', '8.64', '11.27'],
      ['2.00mm', '2.25', '3', '6.9', '8.02', '9.60', '12.52'],
      ['2.50mm', '3.84', '6', '7.32', '8.51', '10.18', '13.29'],
    ],
  },
  'pjbr-506-across-em-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2X3.0', '7.80', '25', '11.2', '13.02', '15.58', '20.33'],
      ['4X2.8', '6.10', '20', '9.8', '11.39', '13.63', '17.79'],
      ['3.5X2.5', '5.40', '15', '8.2', '9.53', '11.41', '14.88'],
      ['3X2', '4.20', '10', '7.6', '8.84', '10.57', '13.79'],
    ],
  },
  'pjbr-506-across-ov-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '7.00', '25', '12.5', '14.53', '17.39', '22.69'],
      ['4.7X3.4', '5.50', '20', '11.5', '13.37', '16.00', '20.87'],
      ['4.3X3.0', '5.20', '15', '10.6', '12.32', '14.74', '19.24'],
      ['3.7X2.7', '4.10', '10', '9.1', '10.58', '12.66', '16.52'],
    ],
  },
  'pjbr-506-em-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2X3.0', '7.80', '25', '11.2', '13.02', '15.58', '20.33'],
      ['4X2.8', '6.10', '20', '9.8', '11.39', '13.63', '17.79'],
      ['3.5X2.5', '5.40', '15', '8.2', '9.53', '11.41', '14.88'],
      ['3X2', '4.20', '10', '7.6', '8.84', '10.57', '13.79'],
    ],
  },
  'pjbr-506-ov-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '6.80', '25', '10.2', '11.86', '14.19', '18.51'],
      ['4.7X3.4', '5.90', '20', '8.9', '10.35', '12.38', '16.15'],
      ['4.3X3.0', '5.10', '15', '8.2', '9.53', '11.41', '14.88'],
      ['3.7X2.7', '4.20', '10', '6.9', '8.02', '9.60', '12.52'],
    ],
  },
  'pjbr-506-pe-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5X3.5', '6.00', '25', '10.2', '11.86', '14.19', '18.51'],
      ['5X3.2', '5.40', '20', '8.6', '10.00', '11.96', '15.61'],
      ['4.6X3.0', '4.65', '15', '7.9', '9.18', '10.99', '14.34'],
      ['4X2.6', '3.10', '10', '6.5', '7.56', '9.04', '11.80'],
    ],
  },
  'pjbr-506-rd-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['2.00mm', '1.30', '3', '6.6', '7.67', '9.18', '11.98'],
      ['2.50mm', '2.50', '6', '7.8', '9.07', '10.85', '14.16'],
      ['3.00mm', '3.80', '10', '9.8', '11.39', '13.63', '17.79'],
      ['3.50mm', '5.00', '15', '10.3', '11.97', '14.33', '18.69'],
      ['3.80mm', '6.80', '20', '11.6', '13.49', '16.14', '21.05'],
      ['4.00mm', '7.30', '25', '12.3', '14.30', '17.11', '22.32'],
    ],
  },
  'pjbr-508-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4x2.6mm', '6.48', '10', '6.76', '7.86', '9.40', '12.27'],
      ['4.6x3mm', '5.44', '15', '8.86', '10.30', '12.32', '16.08'],
      ['5x3.2mm', '8.00', '20', '8.9', '10.35', '12.38', '16.15'],
      ['5.5x3.5mm', '9.24', '25', '10.35', '12.03', '14.40', '18.79'],
    ],
  },
  'pjbr-513-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5x3.5mm', '5.80', '25', '10', '11.63', '13.91', '18.15'],
      ['5X3.2', '5.10', '20', '8.6', '10.00', '11.96', '15.61'],
      ['4.6X3.0', '4.30', '15', '7.9', '9.18', '10.99', '14.34'],
      ['4X2.6', '3.10', '10', '6.8', '7.91', '9.46', '12.34'],
    ],
  },
  'pjbr-514-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['2.00mm', '1.47', '3', '5.5', '6.39', '7.65', '9.98'],
      ['2.50mm', '2.88', '6', '7', '8.14', '9.74', '12.71'],
      ['3.00mm', '4.00', '10', '8.7', '10.11', '12.10', '15.79'],
      ['3.50mm', '5.55', '15', '9.3', '10.81', '12.94', '16.88'],
      ['3.80mm', '7.00', '20', '10.6', '12.32', '14.74', '19.24'],
      ['4.00mm', '7.75', '25', '10.9', '12.67', '15.16', '19.78'],
    ],
  },
  'pjbr-516-mlt-rd-pr': {
    nameUpdate: 'PJBR 516 MLT RD-PR-OVL-EM-MQ-CS',
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['Multi-Shape', '5.25', '15', '8.9', '10.35', '12.38', '16.15'],
      ['Multi-Shape', '5.61', '20', '10.75', '12.50', '14.95', '19.51'],
      ['Multi-Shape', '8.30', '25', '11.22', '13.04', '15.61', '20.36'],
      ['Multi-Shape', '10.40', '35', '11.63', '13.52', '16.18', '21.11'],
      ['Multi-Shape', '13.35', '50', '12.21', '14.20', '16.98', '22.16'],
    ],
  },
  'pjbr-520-across-ov-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '7.80', '25', '12.5', '14.53', '17.39', '22.69'],
      ['4.7X3.4', '6.10', '20', '11.5', '13.37', '16.00', '20.87'],
      ['4.3X3.0', '5.60', '15', '10.6', '12.32', '14.74', '19.24'],
      ['3.7X2.7', '4.40', '10', '9.1', '10.58', '12.66', '16.52'],
    ],
  },
  'pjbr-520-em-bz': {
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
  'pjbr-520-ov-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '7.20', '25', '11.3', '13.14', '15.72', '20.51'],
      ['4.7X3.4', '6.35', '20', '9.3', '10.81', '12.94', '16.88'],
      ['4.3X3.0', '5.60', '15', '8.8', '10.23', '12.24', '15.97'],
      ['3.7X2.7', '4.60', '10', '7.2', '8.37', '10.02', '13.07'],
    ],
  },
  'pjbr-520-pe-bz': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5X3.5', '6.00', '25', '10.6', '12.32', '14.74', '19.24'],
      ['5X3.2', '5.40', '20', '8.9', '10.35', '12.38', '16.15'],
      ['4.6X3.0', '4.65', '15', '8.3', '9.65', '11.55', '15.06'],
      ['4X2.6', '3.10', '10', '6.9', '8.02', '9.60', '12.52'],
    ],
  },
};

async function updateBraceletsBatch2() {
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

      if (data.nameUpdate) {
        item.name = data.nameUpdate;
      }

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

    if (data.nameUpdate && product.name !== data.nameUpdate) {
      await withDbRetry(() =>
        prisma.product.update({
          where: { id: product.id },
          data: { name: data.nameUpdate },
        })
      );
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

  console.log('All Bracelet Batch 2 tables successfully updated in JSON & DB!');
}

updateBraceletsBatch2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
