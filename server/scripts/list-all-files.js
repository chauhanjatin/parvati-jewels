const fs = require('fs');
const path = require('path');

const ringDir = path.resolve('src/assets/dummy-data/ring');
const subdirs = fs.readdirSync(ringDir);

console.log('Listing all product folders and their exact files:');
for (const sub of subdirs) {
  const subPath = path.join(ringDir, sub);
  if (!fs.statSync(subPath).isDirectory()) continue;
  const prods = fs.readdirSync(subPath);
  for (const prod of prods) {
    const prodPath = path.join(subPath, prod);
    if (!fs.statSync(prodPath).isDirectory()) continue;
    const files = fs.readdirSync(prodPath);
    console.log(`${sub} / ${prod} ->`, files);
  }
}
