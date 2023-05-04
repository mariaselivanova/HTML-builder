const { mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

async function copyFiles(oldFolder, newFolder) {
  const files = await readdir(oldFolder, { withFileTypes: true });
  for (const file of files) {
    const oldFilePath = path.join(oldFolder, file.name);
    const newFilePath = path.join(newFolder, file.name);
    await copyFile(oldFilePath, newFilePath);
  }
}

async function compareDirs(first, second) {
  const files1 = await fs.promises.readdir(first);
  const files2 = await fs.promises.readdir(second);
  const filteredFiles2 = files2.filter((file) => files1.includes(file));
  for (const file of files2) {
    if (!filteredFiles2.includes(file)) {
      const filePath = path.join(second, file);
      await fs.promises.unlink(filePath);
    }
  }
}

const oldFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function createFolder(newPath) {
  try {
    await mkdir(newPath, { recursive: true });
    await copyFiles(oldFolder, newFolder);
    await compareDirs(oldFolder, newFolder);
  } catch (err) {
    console.error(err);
  }
}

createFolder(newFolder);