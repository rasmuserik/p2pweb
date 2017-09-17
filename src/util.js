/**
    */

assert = require('./assert');
window = require('./window');

exports.hex2buf = function hex2buf(str) {
  let a = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    a[i / 2] = parseInt(str.slice(i, i + 2), 16);
  }
  return a.buffer;
};

/**
    */
exports.buf2hex = function buf2hex(buf) {
  let a = new Uint8Array(buf);
  let str = '';
  for (var i = 0; i < a.length; ++i) {
    str += (0x100 + a[i]).toString(16).slice(1);
  }
  return str;
};

/**
    */
exports.ascii2buf = function ascii2buf(str) {
  const result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    result[i] = str.charCodeAt(i);
  }
  return result.buffer;
};

/**
    */
exports.buf2ascii = function buf2ascii(buf) {
  return Array.prototype.map
    .call(new Uint8Array(buf), i => String.fromCharCode(i))
    .join('');
};

// TODO
const printLines = [];
function print() {
  const line = [nodes.length === 1 ? nodes[0].name() : '????'].concat(
    Array.from(arguments)
  );
  if (window.document && window.document.getElementById('p2pweb-log')) {
    if (printLines.length > 20) {
      printLines.shift(1);
    }
    printLines.push(line.map(String).join(' '));
    window.document.getElementById('p2pweb-log').innerHTML = `
        <pre>${printLines.join('\n')}</pre>
      `;
  }
  console.log.apply(console, line);
}

exports.throwError = function throwError(msg) {
  throw new Error(msg);
};

exports.tryFn = function tryFn(f, alt) {
  try {
    return f();
  } catch (e) {
    return typeof alt === 'function' ? alt(e) : alt;
  }
};

/**
*/
exports.sleep = function sleep(n = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, n));
};

/**
*/
exports.pairsToObject = function pairsToObject(keyvals) {
  const result = {};
  for (const [key, val] of keyvals) {
    result[key] = val;
  }
  return result;
};

/**
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
