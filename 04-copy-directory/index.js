const { mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

async function copyFiles() {
  const oldFolder = path.join(__dirname, 'files');
  const files = await readdir(oldFolder, { withFileTypes: true });
  for (const file of files) {
    const oldFilePath = path.join(oldFolder, file.name);
    const newFilePath = path.join(__dirname, 'files-copy', file.name);
    await copyFile(oldFilePath, newFilePath);
  }
}

async function createFolder() {
  const folderPath = path.join(__dirname, 'files-copy');
  try {
    await mkdir(folderPath, { recursive: true });
    await copyFiles();
  } catch (err) {
    console.error(err);
  }
}

createFolder();
