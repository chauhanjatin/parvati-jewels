const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('server/data/products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const rings = products.filter(p => p.category === 'rings' || p.category === 'ring');

console.log('Total rings in products.json:', rings.length);
let countWithDummy = 0;
let countWithReal = 0;

rings.forEach(r => {
  if (r.image.includes('ring/')) {
    countWithReal++;
    console.log(`[REAL IMAGE] ${r.name} (${r.subCategory}): ${r.image} (+${r.additionalImages ? r.additionalImages.length : 0} additional)`);
  } else {
    countWithDummy++;
    console.log(`[DUMMY/PLACEHOLDER] ${r.name} (${r.subCategory}): ${r.image}`);
  }
});

console.log(`\nSummary: ${countWithReal} with real ring images, ${countWithDummy} with placeholder.`);
