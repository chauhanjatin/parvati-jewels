const http = require('http');

const categories = ['rings', 'earrings', 'bracelets', 'necklace', 'pendant', 'diamonds'];

async function getCount(cat) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5055/api/products?category=${cat}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const list = Array.isArray(json) ? json : (json.data || []);
          resolve({ category: cat, count: list.length });
        } catch (e) {
          resolve({ category: cat, error: e.message });
        }
      });
    }).on('error', (e) => resolve({ category: cat, error: e.message }));
  });
}

async function main() {
  console.log('--- API Category Counts ---');
  let total = 0;
  for (const cat of categories) {
    const res = await getCount(cat);
    console.log(`${res.category}: ${res.count}`);
    if (res.count) total += res.count;
  }
  console.log(`TOTAL PRODUCTS IN API: ${total}`);
}

main();
