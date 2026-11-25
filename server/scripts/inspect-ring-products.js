const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('server/data/products.json', 'utf8'));
const rings = products.filter(p => p.category === 'rings' || p.category === 'ring');

console.log('Total ring products in products.json:', rings.length);
console.log('Ring styles/subcategories in products.json:');
const subcatCounts = {};
rings.forEach(r => {
  const sc = r.subCategory || r.style || 'none';
  subcatCounts[sc] = (subcatCounts[sc] || 0) + 1;
});
console.log(subcatCounts);

console.log('\nSample ring product:');
console.log(JSON.stringify(rings[0], null, 2));

console.log('\nAll 57 ring IDs, names, slugs, subCategories:');
rings.forEach((r, i) => {
  console.log(`${i + 1}. [ID: ${r.id}] [subCategory: ${r.subCategory}] [name: ${r.name}] [slug: ${r.slug}] [image: ${r.image}]`);
});
