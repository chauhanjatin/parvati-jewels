const fs = require('fs');
const path = require('path');

const srcEar = path.resolve('src/assets/dummy-data/earring');
const pubEar = path.resolve('public/assets/dummy-data/earring');

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

console.log('Ensuring earring assets in public/assets/dummy-data/earring...');
if (!fs.existsSync(pubEar)) {
  console.log('Copying earring images from src/assets/dummy-data/earring to public/assets/dummy-data/earring...');
  copyRecursiveSync(srcEar, pubEar);
} else {
  console.log('public/assets/dummy-data/earring already exists (linked or copied).');
}

let count = 0;
function countFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) countFiles(full);
    else count++;
  }
}
countFiles(pubEar);
console.log(`Verified earring assets in public directory. Total files: ${count}`);
