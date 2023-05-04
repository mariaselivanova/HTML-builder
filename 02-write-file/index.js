const fs = require('fs');
const readline = require('readline');
const path = require('path');

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writer = fs.createWriteStream(path.join(__dirname, 'text.txt'), { encoding: 'utf8' });

readLine.setPrompt('Please write something\n');
readLine.prompt();

readLine.on('line', data => {
  if (data.trim().toLowerCase() === 'exit') {
    process.stdout.write('Thats`s it!');
    process.exit();
  } else {
    writer.write(data + '\n');
  }
});

readLine.on('SIGINT', () => {
  process.stdout.write('Thats`s it!');
  process.exit();
});

process.on('error', (err) => {
  process.stdout.write(err.message);
});