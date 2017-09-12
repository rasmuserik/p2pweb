// # Utility Functions
// ## Binary Data
/**
    */
assert = require('./assert');
exports.hex2buf = function hex2buf(str) {
  let a = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    a[i / 2] = parseInt(str.slice(i, i + 2), 16);
  }
  return a.buffer;
}

/**
    */
exports.buf2hex = function buf2hex(buf) {
  let a = new Uint8Array(buf);
  let str = "";
  for (var i = 0; i < a.length; ++i) {
    str += (0x100 + a[i]).toString(16).slice(1);
  }
  return str;
}

/**
    */
exports.ascii2buf = function ascii2buf(str) {
  const result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    result[i] = str.charCodeAt(i);
  }
  return result.buffer;
}
test(() => {
  assert.deepEqual(Array.from(new Uint8Array(ascii2buf("abcæ"))), [
    97,
    98,
    99,
    230
  ]);
});

/**
    */
exports.buf2ascii = function buf2ascii(buf) {
  return Array.prototype.map
    .call(new Uint8Array(buf), i => String.fromCharCode(i))
    .join("");
}
test(() => {
  assert.deepEqual(
    "abcæ",
    buf2ascii(Uint8Array.from([97, 98, 99, 230]).buffer)
  );
});

// ## Misc

const printLines = [];
/**
    */
function print() {
  const line = [nodes.length === 1 ? nodes[0].name() : "????"].concat(
    Array.from(arguments)
  );
  if (window.document && window.document.getElementById("p2pweb-log")) {
    if (printLines.length > 20) {
      printLines.shift(1);
    }
    printLines.push(line.map(String).join(" "));
    window.document.getElementById("p2pweb-log").innerHTML = `
        <pre>${printLines.join("\n")}</pre>
      `;
  }
  console.log.apply(console, line);
}

/**
    */
function throwError(msg) {
  throw new Error(msg);
}

/**
    */
function tryFn(f, alt) {
  try {
    return f();
  } catch (e) {
    return typeof alt === "function" ? alt(e) : alt;
  }
}
test(() => {
  assert.equal(tryFn(() => "asdf"), "asdf");
  assert.equal(tryFn(() => throwError("asdf")), undefined);
  assert.equal(tryFn(() => throwError("asdf"), 123), 123);
});

/**
    */
function sleep(n = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, n));
}
test(async () => {
  const t0 = Date.now();
  await sleep(100);
  const t = Date.now() - t0;
  assert(90 < t, t);
  assert(t < 110, t);
});

/**
    */
function pairsToObject(keyvals) {
  const result = {};
  for (const [key, val] of keyvals) {
    result[key] = val;
  }
  return result;
}
test(() =>
  assert.deepEqual(pairsToObject([["a", 1], [2, "b"]]), {
    a: 1,
    "2": "b"
  })
);

/**
    */
function getEnv() {
    try {
      return pairsToObject(
        location.hash
          .slice(1)
          .split("&")
          .map(s => s.split("=").map(decodeURIComponent))
          .map(([k, v]) => tryFn(() => [k, JSON.parse(v)], [k, v]))
      );
    } catch (e) {
      print(e);
      return {};
    }
}
