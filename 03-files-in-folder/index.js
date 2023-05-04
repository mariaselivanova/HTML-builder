const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs').promises;

async function findFiles(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      if (!file.isDirectory()) {
        const regex = /^([^.]+)/;
        const fileName = regex.exec(file.name)[1];
        const fileExtension = path.extname(file.name).slice(1);
        const filePath = path.join(folder, file.name);
        const stats = await fs.stat(filePath);
        console.log(fileName + ' - ' + fileExtension + ' - ' + stats.size + 'b');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const folderPath = path.join(__dirname, 'secret-folder');
findFiles(folderPath);

