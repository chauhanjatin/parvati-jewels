const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// The 10 exact tables from the user's images
const tableDataBySlug = {
  'pjr-318-emerald': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.5x3.8mm', '0.5', '3.16', '3.67', '4.40', '5.74'],
      ['6x4.2mm', '0.75', '3.25', '3.78', '4.52', '5.90'],
      ['7x5mm', '1', '3.3', '3.84', '4.59', '5.99'],
      ['7.8x5.8mm', '1.5', '3.35', '3.89', '4.66', '6.08'],
      ['8.5x6mm', '2', '3.4', '3.95', '4.73', '6.17'],
    ],
  },
  'pjr-318-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.5x4.5mm', '0.5', '3.18', '3.70', '4.42', '5.77'],
      ['7x5mm', '0.75', '3.2', '3.72', '4.45', '5.81'],
      ['8.5x5.7mm', '1', '3.25', '3.78', '4.52', '5.90'],
      ['9.3x6.5mm', '1.5', '3.3', '3.84', '4.59', '5.99'],
      ['10.2x7.2mm', '2', '3.35', '3.89', '4.66', '6.08'],
    ],
  },
  'pjr-501-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.5', '2.25', '2.62', '3.13', '4.08'],
      ['5.80mm', '0.75', '2.35', '2.73', '3.27', '4.27'],
      ['6.40mm', '1', '2.45', '2.85', '3.41', '4.45'],
      ['7.00mm', '1.25', '2.55', '2.96', '3.55', '4.63'],
      ['7.40mm', '1.5', '2.65', '3.08', '3.69', '4.81'],
      ['8.20mm', '2', '3.45', '4.01', '4.80', '6.26'],
    ],
  },
  'pjr-502-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.5', '2.3', '2.67', '3.20', '4.17'],
      ['5.80mm', '0.75', '2.39', '2.78', '3.32', '4.34'],
      ['6.40mm', '1', '2.46', '2.86', '3.42', '4.46'],
      ['7.00mm', '1.25', '2.56', '2.98', '3.56', '4.65'],
      ['8.20mm', '2', '2.77', '3.22', '3.85', '5.03'],
    ],
  },
  'pjr-504-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.5', '2.15', '2.50', '2.99', '3.90'],
      ['5.80mm', '0.75', '2.25', '2.62', '3.13', '4.08'],
      ['6.40mm', '1.00', '2.35', '2.73', '3.27', '4.27'],
      ['7.00mm', '1.25', '2.45', '2.85', '3.41', '4.45'],
      ['8.20mm', '2.0', '2.56', '2.98', '3.56', '4.65'],
    ],
  },
  'pjr-505-round': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5.00mm', '0.5', '2.93', '3.41', '4.08', '5.32'],
      ['6.40mm', '1', '3.09', '3.59', '4.30', '5.61'],
      ['7.40mm', '1.5', '3.19', '3.71', '4.44', '5.79'],
      ['8.20mm', '2', '3.4', '3.95', '4.73', '6.17'],
    ],
  },
  'pjr-519-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['7x4.5mm', '0.50', '3', '3.49', '4.17', '5.45'],
      ['8x5mm', '0.75', '3.05', '3.55', '4.24', '5.54'],
      ['9x5.5mm', '1.00', '3.15', '3.66', '4.38', '5.72'],
      ['9.8x6.1mm', '1.25', '3.2', '3.72', '4.45', '5.81'],
      ['10.2x6.5mm', '1.50', '3.3', '3.84', '4.59', '5.99'],
      ['11.2x7.1', '2.00', '3.65', '4.24', '5.08', '6.62'],
    ],
  },
  'pjr-538-oval': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['6.50x4.50mm', '0.5', '3.56', '4.14', '4.95', '6.46'],
      ['8.5x5.7mm', '1.0', '3.95', '4.59', '5.49', '7.17'],
      ['9.3x6.5mm', '1.5', '4.12', '4.79', '5.73', '7.48'],
      ['10.2x7.2mm', '2.0', '4.35', '5.06', '6.05', '7.90'],
    ],
  },
  'pjr-541-pear': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['5x3mm', '0.25', '2.57', '2.99', '3.57', '4.66'],
      ['7x4.5mm', '0.5', '2.62', '3.05', '3.64', '4.76'],
      ['8x5mm', '0.75', '2.71', '3.15', '3.77', '4.92'],
      ['9x5.5mm', '1.0', '3.16', '3.67', '4.40', '5.74'],
      ['10.2x6.5mm', '1.5', '3.29', '3.82', '4.58', '5.97'],
      ['11.2x7.1mm', '2', '3.61', '4.20', '5.02', '6.55'],
    ],
  },
  'pjr-556-princess': {
    type: 'table',
    title: 'Metal & Weight Breakdown',
    headers: ['Head size (mm)', 'Approx Ct Wt', '9kt', '14kt', '18kt', 'Plat'],
    rows: [
      ['4.80mm', '0.75', '3.85', '4.48', '5.36', '6.99'],
      ['5.50mm', '1.00', '4.3', '5.00', '5.98', '7.80'],
      ['6.00mm', '1.25', '4.65', '5.41', '6.47', '8.44'],
      ['6.40mm', '1.5', '5.15', '5.99', '7.16', '9.35'],
      ['6.90mm', '2.00', '5.75', '6.68', '8.00', '10.44'],
    ],
  },
};

async function updatePlainSolitaireRings() {
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

  console.log('All 10 Plain Solitaire Ring tables successfully updated in JSON & DB!');
}

updatePlainSolitaireRings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
