import fs from 'fs';
import path from 'path';
import { getTableOfContents } from '../src';

const doc = fs.readFileSync(path.join(__dirname, './__fixtures__/example.mdx'), 'utf8');

const node = {
  content: doc,
};

test('returns toc tree from node', async () => {
  expect(await getTableOfContents(node)).toMatchSnapshot();
});

test('preserves inline heading text in toc titles', async () => {
  expect(
    await getTableOfContents({
      content: '# Configure `next.config.js` for **images**',
    })
  ).toEqual({
    items: [
      {
        title: 'Configure next.config.js for images',
        url: '#configure-nextconfigjs-for-images',
      },
    ],
  });
});
