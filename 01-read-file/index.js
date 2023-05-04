const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'text.txt');
const reader = fs.createReadStream(textPath, { encoding: 'utf8' });

reader.on('data', (chunk) => {
  process.stdout.write(chunk);
});

reader.on('error', (err) =>  {
  console.log(err.message);
});