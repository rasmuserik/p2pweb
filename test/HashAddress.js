const HashAddress = require("../src/HashAddress");

describe("HashAddress", () => {
  it("can create addresses, and they support equality check", async () => {
    let a = await HashAddress.generate("hello world");
    let b = await HashAddress.generate("hello world");
    let c = await HashAddress.generate("hello wørld");
    a.equals(b) || throwError("equals1");
    !a.equals(c) || throwError("equals2");
  });

  it("converts to/from ArrayBuffer/String", async () => {
    let a = await HashAddress.generate("hello");
    let b = HashAddress.fromArrayBuffer(a.toArrayBuffer());
    let c = HashAddress.fromString(a.toString());
    let x80 = HashAddress.fromString(
      "gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
    a.equals(b) || throwError();
    a.equals(c) || throwError();
    x80.toHex().startsWith("800") || throwError();
  });

  it("measures xor-distance to other HashAddresses", () => {
    let h;
    let zero = HashAddress.fromHex(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );

    h = HashAddress.fromHex(
      "0000000000000000000000000000001000000000000000000000000000000000"
    );
    zero.dist(h) === 1 || throwError();

    h = HashAddress.fromHex(
      "8000000000000000000000000000000000000000000000000000000000000000"
    );
    zero.dist(h) === 2 ** 123 || throwError();
    zero.distBit(h) === 0 || throwError();

    h = HashAddress.fromHex(
      "0000000000000000000000000000000000000000000000000000000000000001"
    );
    zero.dist(h) === 2 ** -132 || throwError();
    zero.distBit(h) === 255 || throwError();

    h = HashAddress.fromHex(
      "0f00000000000000000000000000000000000000000000000000000000000000"
    );
    zero.distBit(h) === 4 || throwError();
  });

  it("can flip a given bit, and randomize thereadter", () => {
    let zero = HashAddress.fromHex(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );

    zero
      .flipBitRandomise(3)
      .toHex()
      .startsWith("1") || throwError();
    zero
      .flipBitRandomise(7)
      .toHex()
      .startsWith("01") || throwError();
    zero
      .flipBitRandomise(7 + 8)
      .toHex()
      .startsWith("0001") || throwError();
  });
});
