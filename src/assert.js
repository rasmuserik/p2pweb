function assert(e, msg) {
  if (!e) {
    throw new Error(msg);
  }
}

/*
  assert.equal = (a, b, msg) => {
    assert(!msg);
    if (a !== b) {
      throwError(
        `${msg || "assert.equal error:"}\n${String(a)} !== ${String(b)}`
      );
    }
  };

  assert.deepEqual = (a, b, msg) => {
    assert.equal(JSON.stringify(a), JSON.stringify(b), msg);
  };

  assert.throws = (f, check, msg) => {
    assert(!check && !msg);
    try {
      f();
      throwError("assert.throws error");
    } catch (e) {}
  };
  */

module.exports = assert;
