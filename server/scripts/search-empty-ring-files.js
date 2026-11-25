const fs = require('fs');
const path = require('path');

const emptyFolders = [
  'PJR-601',
  'PJR-605',
  'PJR-608',
  'PJR-615',
  'PJR-618',
  'PJR-630',
  'PJR-540',
  'PJR-579'
];

function searchDirForFiles(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === '.next' || item === 'out') continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchDirForFiles(fullPath);
      } else {
        for (const ef of emptyFolders) {
          if (item.toLowerCase().includes(ef.toLowerCase())) {
            console.log('Found match for ' + ef + ':', fullPath);
          }
        }
      }
    }
  } catch (e) {}
}

searchDirForFiles('f:\\react\\parvati-jewels');
console.log('Search done.');
