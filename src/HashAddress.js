const window = require('./window');
const assert = require('./assert');
const {ascii2buf, buf2ascii, hex2buf, buf2hex} = require('../src/util');

/** Hashes as addresses, and utility functions for Kademlia-like routing.
 */
module.exports = class HashAddress {
  constructor(o) {
    if (o instanceof Uint8Array && o.length === 32) {
      this.data = o;
    } else {
      throw new Error();
    }
  }

  /**
   *
    */
  static async generate(src /* ArrayBuffer | String */) {
    if (typeof src === 'string') {
      src = ascii2buf(src);
    } else {
      assert(src instanceof ArrayBuffer);
    }
    let hash = await window.crypto.subtle.digest('SHA-256', src);
    return new HashAddress(new Uint8Array(hash));
  }

  /**
    */
  equals(addr) {
    for (let i = 0; i < 32; ++i) {
      if (this.data[i] !== addr.data[i]) {
        return false;
      }
    }
    return true;
  }

  /**
    */
  static fromUint8Array(buf) {
    return new HashAddress(buf.slice());
  }

  /**
    */
  static fromArrayBuffer(buf) {
    return HashAddress.fromUint8Array(new Uint8Array(buf));
  }

  /**
    */
  static fromString(str) {
    return HashAddress.fromArrayBuffer(ascii2buf(window.atob(str)));
  }

  /**
    */
  static fromHex(str) {
    return HashAddress.fromArrayBuffer(hex2buf(str));
  }

  /**
    */
  toArrayBuffer() {
    return this.data.slice().buffer;
  }

  /**
    */
  toString() {
    return window.btoa(buf2ascii(this.toArrayBuffer()));
  }

  /**
    */
  toHex() {
    return buf2hex(this.toArrayBuffer());
  }

  /**
   * xor-distance between two addresses, - with 24 significant bits, 
   * and with an offset such that the distance between `0x000..` 
   * and `0x800...` is `2 ** 123`, and distance `0b1111..` and 
   * `0b1010111..` is `2**122 + 2**120`. 
   * This also means that the distance can be represented 
   * within a single precision float. (with some loss on least significant bits)
   */
  dist(addr) {
    let a = new Uint8Array(this.data);
    let b = new Uint8Array(addr.data);
    for (let i = 0; i < 32; ++i) {
      if (a[i] !== b[i]) {
        return (
          2 ** (93 - i * 8) *
          (((a[i] ^ b[i]) << 23) |
            ((a[i + 1] ^ b[i + 1]) << 15) |
            ((a[i + 2] ^ b[i + 2]) << 7) |
            ((a[i + 3] ^ b[i + 3]) >> 1))
        );
      }
    }
    return 0;
  }

  /**
   * index of first bit in addr that is different. 
   */
  distBit(addr) {
    return HashAddress.distBit(this.dist(addr));
  }

  /*
   * addr1.logDist(addr2) === HashAddress.logDist(addr1.dist(addr2))
   */
  static distBit(dist) {
    return 123 - Math.floor(Math.log2(dist));
  }

  /**
   * Flip the bit at pos, and randomise every bit after that
   */
  flipBitRandomise(pos) {
    let src = new Uint8Array(this.data);
    let dst = src.slice();
    let bytepos = pos >> 3;
    window.crypto.getRandomValues(dst.subarray(bytepos));

    let mask = 0xff80 >> (pos & 7);
    let inverse = 0x80 >> (pos & 7);
    dst[pos >> 3] =
      (src[bytepos] & mask) | ((dst[bytepos] & ~mask) ^ inverse);

    return new HashAddress(dst);
  }
};
