const fs = require('fs');
const path = require('path');

const srcNeck = path.resolve('src/assets/dummy-data/necklace');
const pubNeck = path.resolve('public/assets/dummy-data/necklace');

function syncMissingFiles(src, dest) {
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      syncMissingFiles(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        console.log('Copying missing file:', destPath);
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

syncMissingFiles(srcNeck, pubNeck);

let c = 0;
function count(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) count(full);
    else c++;
  }
}
count(pubNeck);
console.log('Total files in public/assets/dummy-data/necklace now:', c);
