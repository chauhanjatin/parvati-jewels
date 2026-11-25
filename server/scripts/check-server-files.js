const fs = require('fs');
const path = require('path');

const serverDir = path.resolve('server');
const files = fs.readdirSync(serverDir);
console.log('Files in server:', files);
if (fs.existsSync('server/routes')) {
  console.log('Files in server/routes:', fs.readdirSync('server/routes'));
}
