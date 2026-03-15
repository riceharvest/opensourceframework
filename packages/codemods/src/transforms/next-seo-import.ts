import { API, FileInfo } from 'jscodeshift';

/**
 * Codemod to update next-seo imports to @opensourceframework/next-seo
 */
export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all imports from 'next-seo'
  root.find(j.ImportDeclaration, {
    source: { value: 'next-seo' }
  }).forEach(path => {
    path.node.source.value = '@opensourceframework/next-seo';
  });

  // Find all require calls from 'next-seo'
  root.find(j.CallExpression, {
    callee: { name: 'require' },
    arguments: [{ value: 'next-seo' }]
  }).forEach(path => {
    const arg = path.node.arguments[0];
    if (arg.type === 'Literal' || arg.type === 'StringLiteral') {
      arg.value = '@opensourceframework/next-seo';
    }
  });

  return root.toSource();
}
