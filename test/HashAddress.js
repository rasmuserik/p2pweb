const HashAddress = require('../src/HashAddress');
const assert = require('assert');

describe('HashAddress', () => {
  it('can create addresses, and they support equality check', async () => {
    let a = await HashAddress.generate('hello world');
    let b = await HashAddress.generate('hello world');
    let c = await HashAddress.generate('hello wørld');
    assert.equal(a.equals(b), true);
    assert.equal(a.equals(c), false);
  });

  it('converts to/from ArrayBuffer/String', async () => {
    let a = await HashAddress.generate('hello');
    let b = HashAddress.fromArrayBuffer(a.toArrayBuffer());
    let c = HashAddress.fromString(a.toString());
    let x80 = HashAddress.fromString(
      'gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    );
    assert(a.equals(b));
    assert(a.equals(c));
    assert(x80.toHex().startsWith('800'));
  });

  it('measures xor-distance to other HashAddresses', () => {
    let h;
    let zero = HashAddress.fromHex(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );

    h = HashAddress.fromHex(
      '0000000000000000000000000000001000000000000000000000000000000000'
    );
    assert.equal(zero.dist(h), 1);

    h = HashAddress.fromHex(
      '8000000000000000000000000000000000000000000000000000000000000000'
    );
    assert.equal(zero.dist(h), 2 ** 123);
    assert.equal(zero.distBit(h), 0);

    h = HashAddress.fromHex(
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
    assert.equal(zero.dist(h), 2 ** -132);
    assert.equal(zero.distBit(h), 255);

    h = HashAddress.fromHex(
      '0f00000000000000000000000000000000000000000000000000000000000000'
    );
    assert.equal(zero.distBit(h), 4);
  });

  it('can flip a given bit, and randomize thereadter', () => {
    let zero = HashAddress.fromHex(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );

    assert(
      zero
        .flipBitRandomise(3)
        .toHex()
        .startsWith('1')
    );
    assert(
      zero
        .flipBitRandomise(7)
        .toHex()
        .startsWith('01')
    );
    assert(
      zero
        .flipBitRandomise(7 + 8)
        .toHex()
        .startsWith('0001')
    );
  });
});
