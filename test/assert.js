const assert = require("assert");
const browserAssert = require("../src/assert");

describe("assert", () => {
  it("throws depending on parameter", () => {
    browserAssert(true);
    assert.throws(() => browserAssert(false));
  });
});
