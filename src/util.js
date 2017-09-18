/**
    */

const window = require('./window');

/** Find unique values in array
*/
exports.unique = function(arr, f) {
  f = f || String;
  const hash = {};
  for (const val of arr) {
    hash[f(val)] = val;
  }
  return Object.values(hash);
};

/** Convert hex string to ArrayBuffer
*/
exports.hex2buf = function hex2buf(str) {
  let a = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    a[i / 2] = parseInt(str.slice(i, i + 2), 16);
  }
  return a.buffer;
};

/** Convert ArrayBuffer to hex string
    */
exports.buf2hex = function buf2hex(buf) {
  let a = new Uint8Array(buf);
  let str = '';
  for (var i = 0; i < a.length; ++i) {
    str += (0x100 + a[i]).toString(16).slice(1);
  }
  return str;
};

/** Convert 8-bit string to ArrayBuffer
    */
exports.ascii2buf = function ascii2buf(str) {
  const result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    result[i] = str.charCodeAt(i);
  }
  return result.buffer;
};

/** Convert arrayBuffer to 8-bit string
    */
exports.buf2ascii = function buf2ascii(buf) {
  return Array.prototype.map
    .call(new Uint8Array(buf), i => String.fromCharCode(i))
    .join('');
};

/** Expression `throw new Error(...)`
*/
exports.throwError = function throwError(msg) {
  throw new Error(msg);
};

/** Expression try/catch
*/
exports.tryFn = function tryFn(f, alt) {
  try {
    return f();
  } catch (e) {
    return typeof alt === 'function' ? alt(e) : alt;
  }
};

/** Sleep promise
*/
exports.sleep = function sleep(n = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, n));
};

/** Convert array of `[key, value]` to object.
*/
exports.pairsToObject = function pairsToObject(keyvals) {
  const result = {};
  for (const [key, val] of keyvals) {
    result[key] = val;
  }
  return result;
};

/** Extract environment from `location.hash`
    */
exports.getEnv = function getEnv() {
  try {
    return exports.pairsToObject(
      window.location.hash
        .slice(1)
        .split('&')
        .map(s => s.split('=').map(decodeURIComponent))
        .map(([k, v]) =>
          exports.tryFn(() => [k, JSON.parse(v)], [k, v])
        )
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
};
