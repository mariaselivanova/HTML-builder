const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
const outputStream = fs.createWriteStream(outputFile);

async function readFiles(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      const fileExtension = path.extname(file.name);
      if (!file.isDirectory() && fileExtension === '.css') {
        fs.createReadStream(path.join(folder, file.name)).pipe(outputStream);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const folder = path.join(__dirname, 'styles');
readFiles(folder);

  