const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('server/data/products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const necklaces = products.filter(p => p.category === 'necklace' || p.category === 'necklaces');
console.log(`Found ${necklaces.length} necklace products in products.json:\n`);

necklaces.forEach((n, i) => {
  console.log(`${i + 1}. [ID: ${n.id}] [slug: ${n.slug}] [name: ${n.name}] [subCategory: ${n.subCategory || 'none'}] [image: ${n.image}]`);
});
