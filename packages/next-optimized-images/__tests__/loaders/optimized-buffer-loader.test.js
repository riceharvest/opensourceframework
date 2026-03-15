const optimizedBufferLoader = require('../../lib/loaders/optimized-buffer-loader');

const runLoader = (input, options) => new Promise((resolve, reject) => {
  const callback = (error, output) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(output);
  };

  const context = {
    getOptions: () => options,
    async: () => callback,
  };

  const result = optimizedBufferLoader.call(context, Buffer.from(input));

  if (result) {
    resolve(result);
  }
});

describe('next-optimized-images/loaders/optimized-buffer-loader', () => {
  it('runs optimization plugins without imagemin', async () => {
    const output = await runLoader('open source', {
      plugins: [
        (buffer) => Buffer.from(buffer.toString().toUpperCase()),
        async (buffer) => Buffer.concat([buffer, Buffer.from('!')]),
      ],
    });

    expect(output.toString()).toEqual('OPEN SOURCE!');
  });
});
