const fs = require('fs');
const path = require('path');

const packagesDir = path.join(process.cwd(), 'docs/app/packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(pkg => {
  const file = path.join(packagesDir, pkg, 'page.mdx');
  if (!fs.existsSync(file)) return;

  let content = fs.readFileSync(file, 'utf8');

  // 1. Self-close img tags (if not already)
  // Simple check for unclosed img tags
  content = content.replace(/<img ([^>]*?)(?<!\/)>/g, '<img $1 />');

  // 2. Self-close br tags
  content = content.replace(/<br>/g, '<br />');
  content = content.replace(/<br\/>/g, '<br />');

  // 3. Escape generic type markers like <T> or <U>
  content = content.replace(/<([A-Z])>/g, '\\<$1\\>');

  // 4. Convert bracketed URLs to markdown links
  content = content.replace(/<(https?:\/\/[^>]+)>/g, '[$1]($1)');

  // 5. Escape curly braces in regular text (outside of code blocks)
  const lines = content.split('\n');
  let inCodeBlock = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) return line;

    // Escape { and } in normal text
    let newLine = line.replace(/\{ /g, '\\{ ');
    newLine = newLine.replace(/ \}/g, ' \\}');
    
    // Also catch some common patterns like {path, domain}
    newLine = newLine.replace(/\{([a-z, ]+)\}/gi, (match, p1) => {
        // If it looks like a JSX prop or expression, we might need to be careful
        // but in READMEs it's usually text describing an object.
        return '\\{' + p1 + '\\}';
    });
    
    return newLine;
  });

  fs.writeFileSync(file, processedLines.join('\n'));
});
