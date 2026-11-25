const fs = require('fs');
const path = require('path');

const neckDir = path.resolve('src/assets/dummy-data/necklace');
console.log('Necklace dir exists:', fs.existsSync(neckDir));

if (fs.existsSync(neckDir)) {
  const items = fs.readdirSync(neckDir);
  console.log(`Found ${items.length} items in necklace directory:`);
  let totalFiles = 0;
  for (const item of items) {
    const itemPath = path.join(neckDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const files = fs.readdirSync(itemPath);
      totalFiles += files.length;
      console.log(`  ${item} (${files.length} files):`, files.join(', '));
    } else {
      console.log(`  [FILE] ${item}`);
    }
  }
  console.log(`\nTotal files across all folders: ${totalFiles}`);
}
