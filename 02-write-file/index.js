const fs = require('fs');
const readline = require('readline');
const path = require('path');

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const textPath = path.join(__dirname, 'text.txt');
const writer = fs.createWriteStream(textPath, { encoding: 'utf8' });

function showByeMessage() {
  process.stdout.write('Thats`s it!');
  process.exit();
}

readLine.setPrompt('Please write something\n');
readLine.prompt();

readLine.on('line', data => {
  if (data.trim().toLowerCase() === 'exit') {
    showByeMessage();
  } else {
    writer.write(data + '\n');
  }
});

readLine.on('SIGINT', () => {
  showByeMessage();
});

process.on('error', (err) => {
  process.stdout.write(err.message);
});