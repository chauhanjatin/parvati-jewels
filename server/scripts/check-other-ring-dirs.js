const fs = require('fs');
const path = require('path');

const checkDirs = [
  'public/products/rings',
  'src/assets/rings',
  'src/assets/ring-detail',
  'public/assets/dummy-data',
];

for (const d of checkDirs) {
  const p = path.resolve(d);
  if (fs.existsSync(p)) {
    console.log('\n=== ' + d + ' ===');
    const items = fs.readdirSync(p);
    console.log('Count:', items.length);
    console.log('Sample/Items:', items.slice(0, 15).join(', '));
  } else {
    console.log('\n=== ' + d + ' (NOT FOUND) ===');
  }
}
