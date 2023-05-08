const { mkdir, readdir, copyFile, unlink } = require('fs/promises');
const path = require('path');

async function copyFiles(oldFolder, newFolder) {
  const files = await readdir(oldFolder, { withFileTypes: true });
  for (const file of files) {
    const oldFilePath = path.join(oldFolder, file.name);
    const newFilePath = path.join(newFolder, file.name);
    await copyFile(oldFilePath, newFilePath);
  }
}

async function compareDirs(first, second) {
  const originalFiles = await readdir(first);
  const copiedFiles = await readdir(second);
  const filteredFiles = copiedFiles.filter((file) => originalFiles.includes(file));
  for (const file of copiedFiles) {
    if (!filteredFiles.includes(file)) {
      const filePath = path.join(second, file);
      await unlink(filePath);
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