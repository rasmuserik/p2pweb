const window = require('./window');
const {hex2buf} = require('./util');
const assert = require('assert');

if (!window.atob) {
  window.atob = str => Buffer.from(str, 'base64').toString('binary');
  window.btoa = str => Buffer.from(str, 'binary').toString('base64');
}

if (!window.crypto) {
  window.crypto = {subtle: {}};
  window.crypto.subtle.digest = async function(cipher, data) {
    assert.equal(cipher, 'SHA-256');
    if (typeof data !== 'string') {
      data = Buffer.from(data);
    }
    return hex2buf(
      require('crypto')
        .createHash('sha256')
        .update(Buffer.from(data))
        .digest('hex')
    );
  };

  window.crypto.getRandomValues = dst =>
    new Promise((resolve, reject) => {
      const arr = new Uint8Array(dst);
      require('crypto').randomBytes(arr.length, (err, buf) => {
        if (err) {
          return reject(err);
        } else {
          arr.set(buf);
          resolve();
        }
      });
    });
}

if (!window.navigator) {
  window.navigator = 'NodeJS';
}

if (!window.location) {
  const env = process.env;
  window.location = {
    hash:
      '#' +
      Object.keys(env)
        .map(
          k => encodeURIComponent(k) + '=' + encodeURIComponent(env[k])
        )
        .join('&')
  };
}
