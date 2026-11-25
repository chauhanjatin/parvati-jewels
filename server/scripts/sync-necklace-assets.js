const fs = require('fs');
const path = require('path');

const srcNeck = path.resolve('src/assets/dummy-data/necklace');
const pubNeck = path.resolve('public/assets/dummy-data/necklace');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying necklace images from src/assets/dummy-data/necklace to public/assets/dummy-data/necklace...');
copyRecursiveSync(srcNeck, pubNeck);

// Verify count of copied files
let count = 0;
function countFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) countFiles(full);
    else count++;
  }
}
countFiles(pubNeck);
console.log(`Successfully synced necklace assets to public directory. Total files: ${count}`);
