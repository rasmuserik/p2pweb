require('../src/shims-nodejs');
const window = require('../src/window');
const assert = require('assert');
const {
  hex2buf,
  buf2hex,
  ascii2buf,
  buf2ascii,
  print,
  throwError,
  tryFn,
  sleep,
  pairsToObject,
  getEnv,
  set,
  get,
  merge
} = require('../src/util');

describe('util', () => {
  it('merges objects', () => {
    assert.deepEqual(
      merge({a:1, b: {c: 2}, d: 3}, {d:[4], b: {e: 5}}),
      {a:1,b:{c:2, e: 5}, d:[4]});
  });
  it('sets value deep in objects/arrays', () => {
    assert.deepEqual(set(['a'], [2], 'b'), ['a', , 'b']);
    assert.deepEqual(set(['a', 'x', 'c'], [1], 'b'), ['a', 'b', 'c']);
    assert.deepEqual(
      set({a:2, b:[0,1,2]}, ['b', 2, 'a', 1], 'hello'),
      {a:2, b:[0, 1, {a: [, 'hello']}]});
    assert.deepEqual(set({a:1}, 'b.c', 'd'), {a:1, b: {c: 'd'}});
  });
  it('gets value at path, with default value', () => {
    assert.equal(get({}, 'a.b.c'), undefined);
    assert.equal(get({a:{b:{c:'d'}}}, 'a.b.c'), 'd');
    assert.equal(get({a:['b', 'c']}, ['a', 1]), 'c');
    assert.equal(get({}, 'a.b.c', 'x'), 'x');
  });
  it('converts ascii to/from ArrayBuffer', () => {
    assert.deepEqual(Array.from(new Uint8Array(ascii2buf('abcæ'))), [
      97,
      98,
      99,
      230
    ]);
    assert.deepEqual(
      'abcæ',
      buf2ascii(Uint8Array.from([97, 98, 99, 230]).buffer)
    );
  });
  it('supports throw/catch in expressions', () => {
    assert.throws(() => throwError('asfg'));
    assert.equal(tryFn(() => 'asdf'), 'asdf');
    assert.equal(tryFn(() => throwError('asdf')), undefined);
    assert.equal(tryFn(() => throwError('asdf'), 123), 123);
  });
  it('sleeps', async () => {
    const t0 = Date.now();
    await sleep(20);
    const t = Date.now() - t0;
    assert(15 < t, t);
    assert(t < 25, t);
  });
  it('convert pairs to object', () =>
    assert.deepEqual(pairsToObject([['a', 1], [2, 'b']]), {
      a: 1,
      '2': 'b'
    }));
  it('parses location.hash', () => {
    const t = window.location.hash;
    window.location.hash = '#foo=bar&baz=%20';
    const env = getEnv();
    assert.equal(Object.keys(env).length, 2);
    assert.equal(env.baz, ' ');
    window.location.hash = t;
  });
});
