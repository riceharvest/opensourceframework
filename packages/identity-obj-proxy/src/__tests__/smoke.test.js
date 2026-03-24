const idObj = require('..');

describe('identity-obj-proxy fork', () => {
  it('should return the key as a string (smoke test)', () => {
    expect(idObj.smoke).toBe('smoke');
  });
});
