const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === '.next' || item === 'out') continue;
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (pattern.test(item)) {
          console.log('Matching dir:', fullPath);
        }
        searchDir(fullPath, pattern);
      }
    }
  } catch (e) {}
}

console.log('Searching for ring folders across project...');
searchDir('f:\\react\\parvati-jewels', /PJR|GRG|A145|ring|ET|HALO/i);
