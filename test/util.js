require('../src/shims-nodejs');
const assert = require('assert');
const {
  hex2buf, buf2hex, ascii2buf, buf2ascii, print, throwError, tryFn, sleep, pairsToObject, getEnv
} = require('../src/util');


describe('util', () => {
  it('converts ascii to/from ArrayBuffer', () => {
    assert.deepEqual(
      Array.from(new Uint8Array(ascii2buf("abcæ"))), [
        97, 98, 99, 230 ]);
    assert.deepEqual(
      "abcæ",
      buf2ascii(Uint8Array.from([97, 98, 99, 230]).buffer)
    );
  });

  it('supports throw/catch in expressions', () => {
    assert.throws(() => throwError('asfg'));
    assert.equal(tryFn(() => "asdf"), "asdf");
    assert.equal(tryFn(() => throwError("asdf")), undefined);
    assert.equal(tryFn(() => throwError("asdf"), 123), 123);
  });

  it('sleeps', async () => {
    const t0 = Date.now();
    await sleep(20);
    const t = Date.now() - t0;
    assert(15 < t, t);
    assert(t < 25, t);
  });

  it('convert pairs to object', () =>
    assert.deepEqual(pairsToObject([["a", 1], [2, "b"]]), {
      a: 1,
      "2": "b"
    })
  );
});
