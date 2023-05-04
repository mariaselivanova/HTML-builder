const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');


async function findFiles() {
  const folderPath = path.join(__dirname, 'secret-folder');
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files)
      if (!file.isDirectory()) {
        const regex = /^([^.]+)/;
        const fileName = regex.exec(file.name)[1];
        const fileExtension = path.extname(file.name).slice(1);
        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (err, stats) => {
          const sizeInKb = Math.round(stats.size / 1024);
          console.log(fileName + ' - ' + fileExtension  + ' - ' + sizeInKb + 'kB');
        });
      }
  } catch (err) {
    console.error(err);
  }
}
  
findFiles();
