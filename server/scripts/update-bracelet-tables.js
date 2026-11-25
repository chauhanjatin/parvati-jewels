const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 15 exact tables from the user's uploaded images
const tableDataBySlug = {
  'gbg-rd-26': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Size', 'Width', 'Round Diamond Specs', 'Pieces', '10kt Approx Wt'],
    rows: [
      ['7 Inch (56mm)', '4.3mm', '3.0mm Round', '188 PC', '150 gm'],
      ['7 Inch (56mm)', '4.3mm', '2.8mm Round', '128 PC', '150 gm'],
    ],
    specs: {
      stone_shape: 'Round',
      size: '7 Inch (56mm)',
      width: '4.3mm',
      diamonds: '3.0mm (188 PC), 2.8mm (128 PC)',
      total_pieces: '316 PC',
      metal: '10K Gold',
      approx_weight: '150 gm',
    },
  },
  'pjbr-21-mix-bug-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['3.5x2.2mm-2mm', '2.68', '11-3', '4.7', '5.46', '6.54', '8.53'],
    ],
  },
  'pjbr-201-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2X3.0', '6.75', '25', '10.1', '11.74', '14.05', '18.33'],
      ['4X2.8', '5.60', '20', '10.25', '11.92', '14.26', '18.60'],
      ['3.5X2.5', '4.65', '15', '8.7', '10.11', '12.10', '15.79'],
      ['3X2', '3.70', '10', '7.6', '8.84', '10.57', '13.79'],
    ],
  },
  'pjbr-202-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2X3.0', '8.25', '25', '9.2', '10.70', '12.80', '16.70'],
      ['4X2.8', '6.20', '20', '8.9', '10.35', '12.38', '16.15'],
      ['3.5X2.5', '5.55', '15', '7.7', '8.95', '10.71', '13.98'],
      ['3X2', '4.10', '10', '6.4', '7.44', '8.90', '11.62'],
    ],
  },
  'pjbr-203-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '7.75', '25', '11.5', '13.37', '16.00', '20.87'],
      ['4.7X3.4', '5.60', '20', '10.9', '12.67', '15.16', '19.78'],
      ['4.3X3.0', '5.85', '15', '10.2', '11.86', '14.19', '18.51'],
      ['3.7X2.7', '4.20', '10', '8.2', '9.53', '11.41', '14.88'],
    ],
  },
  'pjbr-204-marquise': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5x3mm', '7.80', '30', '6.63', '7.71', '9.22', '12.03'],
      ['4.5X2.5', '6.50', '25', '5.53', '6.43', '7.69', '10.04'],
      ['4X2.5', '5.20', '20', '4.42', '5.14', '6.15', '8.02'],
      ['3.5X2.0', '3.90', '15', '4.33', '5.03', '6.02', '7.86'],
      ['3X2', '2.60', '10', '3.45', '4.01', '4.80', '6.26'],
    ],
  },
  'pjbr-205-mix-oval': {
    nameUpdate: 'PJBR 205 Mix Oval-Round',
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5x3.6mm-3mm', '5.70', '30-10', '7.3', '8.49', '10.15', '13.25'],
    ],
  },
  'pjbr-206-round': {
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
  'pjbr-207-mix-ov-mq': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5x3.6mm-5.2x3.2m', '6.84', '30-24', '6.4', '7.44', '8.90', '11.62'],
    ],
  },
  'pjbr-208-mix-pe-mq': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.6x3mm-5.2x3mm', '4.69', '17-21', '5', '5.81', '6.96', '9.08'],
    ],
  },
  'pjbr-209-mix-em-rd': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.2x3mm-3.5mm', '6.63', '25-17', '6.8', '7.91', '9.46', '12.34'],
    ],
  },
  'pjbr-210-mix-pe-rd': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.6x3mm-3.5mm', '5.27', '17-17', '6.5', '7.56', '9.04', '11.80'],
    ],
  },
  'pjbr-211-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5X3.0', '6.50', '25', '9.9', '11.51', '13.77', '17.97'],
      ['4.7X3.4', '5.60', '20', '8.75', '10.17', '12.17', '15.88'],
      ['4.3X3.0', '4.80', '15', '7.9', '9.18', '10.99', '14.34'],
      ['3.7X2.7', '3.70', '10', '6.45', '7.50', '8.97', '11.71'],
    ],
  },
  'pjbr-212-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5X3.5', '6.00', '25', '9.5', '11.04', '13.21', '17.24'],
      ['5X3.2', '5.40', '20', '8', '9.30', '11.13', '14.52'],
      ['4.6X3.0', '4.65', '15', '7.5', '8.72', '10.43', '13.61'],
      ['4X2.6', '3.10', '10', '6.5', '7.56', '9.04', '11.80'],
    ],
  },
  'pjbr-500-round': {
    nameUpdate: 'PJBR 500 Round (CROWN)',
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', 'PT', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.30mm', '1.02', '1', '4.2', '4.88', '5.84', '7.62'],
      ['1.50mm', '1.53', '1.5', '5.3', '6.16', '7.37', '9.62'],
      ['1.80mm', '2.23', '2.5', '6.21', '7.22', '8.64', '11.27'],
      ['2.00mm', '2.25', '3', '6.9', '8.02', '9.60', '12.52'],
      ['2.50mm', '3.84', '6', '7.2', '8.37', '10.02', '13.07'],
    ],
  },
};

async function updateBracelets() {
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

      if (data.specs) {
        Object.assign(item.specifications, data.specs);
      }

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
      if (data.specs) {
        Object.assign(specs, data.specs);
      }

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

  console.log('All 15 Bracelet tables successfully updated in JSON & DB!');
}

updateBracelets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
