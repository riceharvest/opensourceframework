const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  });
  return results;
}

const cwd = process.cwd();
const cjsDir = path.join(cwd, 'dist', 'cjs');

// Rename all .js files in dist/cjs to .cjs
const jsFiles = getAllFiles(cjsDir, '.js');
jsFiles.forEach(file => {
  const newFile = file.replace(/\.js$/, '.cjs');
  fs.renameSync(file, newFile);
});

// After renaming, update require statements in .cjs files to point to .cjs
const cjsFiles = getAllFiles(cjsDir, '.cjs');
cjsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace require('...js') or require("...js") with .cjs extension, handling any relative paths (e.g., './', '../')
  content = content.replace(/require\((['"])([^'"]+)\.js\1\)/g, "require($1$2.cjs$1)");
  fs.writeFileSync(file, content);
});

console.log('Fixed CJS output: renamed .js to .cjs and updated require statements.');
