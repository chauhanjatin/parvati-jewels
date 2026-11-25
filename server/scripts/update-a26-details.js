const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

const a26WeightDetails = {
  type: 'details',
  title: 'Product Details',
  details: {
    'Stone Shape': 'Round, Heart, Pear & Marquise Cut',
    'Total Stones': '50 Pieces',
    'Round Diamonds': '6.5mm (6pcs), 6.25mm (2pcs), 6.0mm (2pcs), 5.70mm (2pcs), 5.40mm (2pcs), 5.25mm (4pcs), 4.60mm (4pcs), 4.5mm (2pcs) — Total: 24 Pcs',
    'Heart Diamond': '8.05 x 8.65mm (1pc)',
    'Pear Diamonds': '13.15x7.9mm (1pc), 9.40x5.40mm (2pcs), 8x5mm (2pcs), 7.35x4.55mm (2pcs), 6x3.6mm (2pcs) — Total: 9 Pcs',
    'Marquise (MQ)': '10.60x5.35mm (4pcs), 10.20x5.15mm (2pcs), 9.95x5.0mm (2pcs), 8.85x4.75mm (2pcs), 8.55x4.08mm (2pcs), 8.25x4.28mm (2pcs), 8.15x3.75mm (2pcs) — Total: 16 Pcs',
    'Approx Metal Weight': '14kt :- 46.84 gm  |  18kt :- 56.65 gm',
  },
};

async function updateA26() {
  console.log('1. Updating server/data/products.json for A26...');
  const a26Product = products.find(x => x.slug === 'a26');
  if (a26Product) {
    a26Product.weightDetails = a26WeightDetails;
    if (!a26Product.specifications) a26Product.specifications = {};
    a26Product.specifications.weightDetails = a26WeightDetails;
    a26Product.specifications.stone_shape = 'Mixed (Round, Heart, Pear, MQ)';
    a26Product.specifications.total_pieces = '50 Pcs';
    a26Product.specifications.metal_weight = '14kt: 46.84 gm | 18kt: 56.65 gm';
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    console.log('Saved products.json for A26 successfully.');
  } else {
    console.warn('A26 not found in products.json!');
  }

  console.log('\n2. Updating Neon PostgreSQL Database...');
  const product = await withDbRetry(() =>
    prisma.product.findUnique({
      where: { slug: 'a26' },
      include: { variants: true },
    })
  );

  if (product) {
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
      specs.weightDetails = a26WeightDetails;
      specs.stone_shape = 'Mixed (Round, Heart, Pear, MQ)';
      specs.total_pieces = '50 Pcs';
      specs.metal_weight = '14kt: 46.84 gm | 18kt: 56.65 gm';

      await withDbRetry(() =>
        prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            specifications: JSON.stringify(specs),
          },
        })
      );
      console.log(`Updated DB variant for A26 (variantId: ${variant.id})`);
    }
  } else {
    console.warn('Product A26 not found in Neon DB!');
  }

  console.log('\n3. Refreshing in-memory server cache...');
  try {
    const http = require('http');
    const req = http.request('http://localhost:5055/api/cache/refresh', { method: 'POST' }, (res) => {
      console.log(`Cache refresh responded with status: ${res.statusCode}`);
    });
    req.on('error', (e) => console.log('Cache refresh note:', e.message));
    req.end();
  } catch (err) {
    console.log('Cache refresh exception:', err.message);
  }

  console.log('A26 Details Format updated successfully!');
}

updateA26()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
