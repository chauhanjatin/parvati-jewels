const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

let ringCount = 0;
let totalCount = 0;

for (const p of products) {
  const originalName = p.name;
  if (!p.sku) {
    p.sku = originalName;
  }

  if (p.category === 'rings') {
    p.sku = p.sku || originalName;
    p.name = "Bezel Solitaire Marquise Cut Diamond Ring";
    ringCount++;
  }
  totalCount++;
}

fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${ringCount} rings with name "Bezel Solitaire Marquise Cut Diamond Ring" and SKU. Total products: ${totalCount}.`);
