const fs = require('fs');
const path = require('path');

function drawFolderStructure(dirPath, prefix = '') {
  const items = fs.readdirSync(dirPath);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    const connector = isLast ? '└── ' : '├── ';
    console.log(prefix + connector + item);

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      drawFolderStructure(itemPath, newPrefix);
    }
  });
}

// Caminho para o src
const srcPath = path.resolve(__dirname, '../../src');
console.log('src');
drawFolderStructure(srcPath);
