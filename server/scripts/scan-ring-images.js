const fs = require('fs');
const path = require('path');

const ringDir = path.resolve('src/assets/dummy-data/ring');
console.log('Ring dir exists:', fs.existsSync(ringDir));

if (fs.existsSync(ringDir)) {
  const subdirs = fs.readdirSync(ringDir);
  console.log('Subdirectories:', subdirs);
  let totalProds = 0;
  for (const sub of subdirs) {
    const subPath = path.join(ringDir, sub);
    if (fs.statSync(subPath).isDirectory()) {
      const prods = fs.readdirSync(subPath);
      console.log('\n--- ' + sub + ' (' + prods.length + ') ---');
      for (const prod of prods) {
        const prodPath = path.join(subPath, prod);
        if (fs.statSync(prodPath).isDirectory()) {
          const files = fs.readdirSync(prodPath);
          totalProds++;
          console.log('  ' + prod + ' (' + files.length + ' files):', files.slice(0, 10).join(', '));
        } else {
          console.log('  [FILE] ' + prod);
        }
      }
    }
  }
  console.log('\nTotal product folders found:', totalProds);
}
