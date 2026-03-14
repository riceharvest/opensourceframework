import { run, bench, group } from 'mitata';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Critters = require('../dist/index.cjs');

const html = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      .used { color: blue; }
      .unused { color: red; }
      .complex:hover { color: green; }
      @media (min-width: 1000px) {
        .media-used { display: block; }
        .media-unused { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="used">Used</div>
    <div class="media-used">Media Used</div>
  </body>
</html>
`;

group('Critters Performance', () => {
  const critters = new Critters({
    pruneSource: true,
  });

  bench('Process Small HTML', async () => {
    await critters.process(html);
  });
  
  bench('Process Small HTML (no logs)', async () => {
    const c = new Critters({ logLevel: 'warn' });
    await c.process(html);
  });
});

await run();
