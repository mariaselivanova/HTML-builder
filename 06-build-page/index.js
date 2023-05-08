const { mkdir, readdir, readFile, copyFile, stat } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const projectDistFolder = path.join(__dirname, 'project-dist');
const writerPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsFolder = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const outputStyleFile = path.join(__dirname, 'project-dist', 'style.css');
const styleFolder = path.join(__dirname, 'styles');
const oldAssets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');
const outputStyleStream = fs.createWriteStream(outputStyleFile);

let templateData = '';

async function createFolder(newPath) {
  try {
    await mkdir(newPath, { recursive: true });
    console.log(`The folder ${path.basename(newPath)} has been created`);
  } catch (err) {
    console.error(err);
  }
}

async function replaceTags(templateData, folder) {
  try {
    const files = await readdir(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);
      const fileData = await readFile(filePath, { encoding: 'utf8' });
      const tag = `{{${path.basename(file, '.html')}}}`;
      templateData = templateData.replace(tag, fileData);
    }
    console.log('Tags have been replaced');
    return templateData;
  } catch (err) {
    console.error(err);
  }
}

async function buildHTML(templatePath, folder) {
  try {
    templateData = await readFile(templatePath, { encoding: 'utf8' });
    const finalHTML = await replaceTags(templateData, folder);
    const writer = fs.createWriteStream(writerPath, { encoding: 'utf8' });
    writer.write(finalHTML);
    console.log('index.html has been created');
  } catch (error) {
    console.error(error);
  }
}

async function transferStyleFiles(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      const fileExtension = path.extname(file.name);
      if (!file.isDirectory() && fileExtension === '.css') {
        fs.createReadStream(path.join(folder, file.name)).pipe(outputStyleStream);
      }
    }
    console.log('Styles have been transfered');
  } catch (err) {
    console.error(err);
  }
}

async function copyAssetsFolder(originalFolder, copiedFolder) {
  try {
    await fsp.rm(copiedFolder, { recursive: true, force: true });
    const files = await readdir(originalFolder);
    await mkdir(copiedFolder, { recursive: true });
    
    for (const file of files) {
      const sourcePath = path.join(originalFolder, file);
      const destinationPath = path.join(copiedFolder, file);
      const fileStat = await stat(sourcePath);
    
      if (fileStat.isDirectory()) {
        await copyAssetsFolder(sourcePath, destinationPath);
      } else {
        await copyFile(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
  
async function createAssetsFolder(newPath) {
  try {
    await mkdir(newPath, { recursive: true });
    await copyAssetsFolder(oldAssets, newAssets);
    console.log('Assets folder has been created');
  } catch (err) {
    console.error(err);
  }
}
  
createFolder(projectDistFolder)
  .then(() => {
    buildHTML(templatePath, componentsFolder);
    transferStyleFiles(styleFolder);
    createAssetsFolder(newAssets);
  });
