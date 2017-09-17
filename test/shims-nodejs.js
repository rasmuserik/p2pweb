require('../src/shims-nodejs');
const window = require('../src/window');
const assert = require('assert');

describe('shims-nodejs', () => {
  it('should encode/decode base64', () => {
    assert.equal(window.btoa('hello'), 'aGVsbG8=');
    assert.equal(window.atob('aGVsbG8='), 'hello');
  });
});
