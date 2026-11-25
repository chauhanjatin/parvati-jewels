const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { prisma, withDbRetry } = require('../lib/prisma');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// 1. Clean products.json
products.forEach(p => {
  p.price = 0;
  p.comparePrice = null;
  p.description = '';
  p.shortDescription = '';
  p.material = '';
  p.metal = '';
  p.rating = 0;
  p.reviewCount = 0;
  p.size = '';
  
  const weightDetails = p.weightDetails || p.specifications?.weightDetails || null;
  p.weightDetails = weightDetails;
  p.specifications = weightDetails ? { weightDetails } : {};
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Cleaned ${products.length} products in data/products.json`);

// 2. Update PostgreSQL database
async function updateDb() {
  console.log('Updating database records...');
  
  // Update all products in DB to nullify description, material, rating
  await withDbRetry(() =>
    prisma.product.updateMany({
      data: {
        description: null,
        shortDescription: null,
        material: null,
        rating: 0,
        reviewCount: 0,
      },
    })
  );

  // Update variants in DB to set price: 0, metal: null, and keep only weightDetails in specifications
  for (const p of products) {
    const sku = `${p.slug}-default`;
    const specifications = JSON.stringify(p.specifications);

    await withDbRetry(() =>
      prisma.productVariant.updateMany({
        where: { sku },
        data: {
          price: 0,
          comparePrice: null,
          metal: null,
          specifications,
        },
      })
    );
  }

  console.log('Database successfully updated!');
}

updateDb()
  .catch(e => {
    console.error('Error updating DB:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
