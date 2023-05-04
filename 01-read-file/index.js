const fs = require('fs');
const path = require('path');

const reader = fs.createReadStream(path.join(__dirname, 'text.txt'), { encoding: 'utf8' });

reader.on('data', (chunk) => {
  process.stdout.write(chunk);
});

reader.on('error', (err) =>  {
  console.log(err.message);
});