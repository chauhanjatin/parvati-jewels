const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 12 exact tables from the user's images
const tableDataBySlug = {
  'pjr-591-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.50mm', '1.60mm', '0.285', '1.59', '1.85', '2.21', '2.89'],
      ['1.80mm', '2.00mm', '0.425', '2.12', '2.46', '2.95', '3.85'],
      ['2.00mm', '2.20mm', '0.45', '2.02', '2.35', '2.81', '3.67'],
      ['2.20mm', '2.40mm', '0.52', '2.29', '2.66', '3.19', '4.16'],
      ['2.40mm', '2.60mm', '0.6', '2.34', '2.72', '3.25', '4.25'],
      ['2.70mm', '2.90mm', '0.82', '2.97', '3.45', '4.13', '5.39'],
      ['3.00mm', '3.20mm', '1.21', '2.69', '3.13', '3.74', '4.88'],
    ],
  },
  'pjr-594-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['3.00mm', '4.00mm', '0.77', '2.5', '2.91', '3.48', '4.54'],
    ],
  },
  'pjr-601-round-full': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.50mm', '1.70mm', '0.585', '1.69', '1.96', '2.35', '3.07'],
      ['1.80mm', '2.00mm', '0.825', '2.32', '2.70', '3.23', '4.21'],
      ['2.00mm', '2.20mm', '0.84', '2.1', '2.44', '2.92', '3.81'],
      ['2.20mm', '2.40mm', '1.12', '2.67', '3.10', '3.71', '4.85'],
      ['2.40mm', '2.60mm', '1.37', '2.71', '3.15', '3.77', '4.92'],
      ['2.70mm', '2.90mm', '1.72', '3.35', '3.89', '4.66', '6.08'],
      ['3.00mm', '3.20mm', '3.25', '3.25', '3.78', '4.52', '5.90'],
    ],
  },
  'pjr-602-round-half': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['2.00mm', '2.20mm', '0.45', '2.6', '3.02', '3.62', '4.72'],
      ['1.80mm', '2.00mm', '0.37', '2', '2.33', '2.78', '3.63'],
      ['2.40mm', '2.60mm', '0.68', '2.28', '2.65', '3.17', '4.14'],
      ['3.00mm', '3.20mm', '1.1', '3.07', '3.57', '4.27', '5.57'],
    ],
  },
  'pjr-605-round-full-eternity': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.40mm', '5.00mm', '1.26', '4.09', '4.76', '5.69', '7.42'],
    ],
  },
  'pjr-608-half': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.70mm', '1.90mm', '0.345', '2.3', '2.67', '3.20', '4.17'],
      ['2.00mm', '2.20mm', '0.455', '2.86', '3.33', '3.98', '5.19'],
      ['2.50mm', '2.70mm', '0.77', '3.8', '4.42', '5.29', '6.90'],
      ['3.00mm', '3.20mm', '0.99', '5', '5.81', '6.96', '9.08'],
    ],
  },
  'pjr-609-full': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.80mm', '2.00mm', '0.73', '1.45', '1.69', '2.02', '2.63'],
      ['2.00mm', '2.20mm', '0.9', '1.9', '2.21', '2.64', '3.45'],
      ['2.40mm', '2.60mm', '1.3', '2.34', '2.72', '3.25', '4.25'],
      ['2.70mm', '2.90mm', '1.68', '2.76', '3.21', '3.84', '5.01'],
      ['3.00mm', '3.20mm', '2.1', '2.5', '2.91', '3.48', '4.54'],
    ],
  },
  'pjr-611-half': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.50mm', '1.70mm', '0.285', '2.2', '2.56', '3.06', '3.99'],
      ['1.80mm', '2.00mm', '0.47', '2.35', '2.73', '3.27', '4.27'],
      ['2.00mm', '2.20mm', '0.45', '2.6', '3.02', '3.62', '4.72'],
      ['2.20mm', '2.40mm', '0.6', '2.75', '3.20', '3.83', '4.99'],
      ['2.40mm', '2.60mm', '2.17', '0.95', '1.10', '1.32', '1.72'],
    ],
  },
  'pjr-614-half': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['1.80mm', '2.00mm', '0.42', '2.3', '2.67', '3.20', '4.17'],
      ['2.30mm', '2.50mm', '0.7', '2.9', '3.37', '4.03', '5.26'],
      ['2.70mm', '3.00mm', '1', '3.8', '4.42', '5.29', '6.90'],
    ],
  },
  'pjr-615-7stone': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['3.00mm', '3.20mm', '0.77', '2.8', '3.26', '3.89', '5.08'],
      ['2.70mm', '2.90mm', '0.56', '2.68', '3.12', '3.73', '4.86'],
      ['3.30mm', '3.50mm', '1.05', '3.15', '3.66', '4.38', '5.72'],
    ],
  },
  'pjr-618-half': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', 'Side stone Ct', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['0.90MM / 1.5MM', '3.00mm', '0.357', '0.285', '3.29', '3.82', '4.58', '5.97'],
    ],
  },
  'pjr-630-round-5stone': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Dia Size(mm)', 'Band Width', 'Approx Total Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['3.80mm', '3.80mm', '2.00', '3', '3.49', '4.17', '5.45'],
      ['4.00mm', '4.00mm', '2.50', '3.25', '3.78', '4.52', '5.90'],
      ['5.00mm', '5.00mm', '3.50', '4.45', '5.17', '6.19', '8.08'],
      ['3.50mm', '3.50mm', '1.90', '2.6', '3.02', '3.62', '4.72'],
      ['3.00mm', '3.00mm', '1.50', '2.3', '2.67', '3.20', '4.17'],
      ['4.70mm', '4.70mm', '3.00', '4', '4.65', '5.56', '7.26'],
    ],
  },
};

async function updateEtRings() {
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

  console.log('All 12 ET Ring tables successfully updated in JSON & DB!');
}

updateEtRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
