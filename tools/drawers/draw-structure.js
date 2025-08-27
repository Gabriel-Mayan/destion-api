const fs = require('fs');
const path = require('path');

function drawFolderStructure(dirPath, prefix = '', ignore = ['dist', 'node_modules', '.git']) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item, index) => {
    if (ignore.includes(item)) return;

    const isLast = index === items.length - 1;
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    const connector = isLast ? '└── ' : '├── ';
    console.log(prefix + connector + item);

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      drawFolderStructure(itemPath, newPrefix, ignore);
    }
  });
}

// Caminho para o projeto
const srcPath = path.resolve(__dirname, '../../');
console.log('src');
drawFolderStructure(srcPath);
