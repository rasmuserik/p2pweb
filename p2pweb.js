// #
//
// <img src=https://p2pweb.solsort.com/icon.png width=96 height=96 align=right>
//
// [![website](https://img.shields.io/badge/website-p2pweb.solsort.com-blue.svg)](https://p2pweb.solsort.com/)
// [![github](https://img.shields.io/badge/github-solsort/p2pweb-blue.svg)](https://github.com/solsort/p2pweb)
// [![travis](https://img.shields.io/travis/solsort/p2pweb.svg)](https://travis-ci.org/solsort/p2pweb)
// [![coveralls](https://img.shields.io/coveralls/solsort/p2pweb.svg)](https://coveralls.io/r/solsort/p2pweb?branch=master)
// [![npm](https://img.shields.io/npm/v/p2pweb.svg)](https://www.npmjs.com/package/p2pweb)
//
// # P2P Web
//
//
//
// This is a library for building peer-to-peer web applications.
//
// **Under development**
//
// (literate source code below)
//
(function(p2pweb) {
  "use strict";
  //
  // # Environment
  //
  const isNodeJs = getIsNodeJs();
  const env = getEnv();
  const bootstrapString =
    env.P2PWEB_BOOTSTRAP || "wss://sea.solsort.com/";
  const bootstrapNodes = bootstrapString.trim().split(/\s+/);
  /* istanbul ignore next */
  const assert = isNodeJs ? require("assert") : assertImpl();
  /* istanbul ignore next */
  const window = isNodeJs ? global : self;
  const platform = {};
  platform.startSignalling = undefined;
  platform.receiveSignalling = undefined;
  platform.connection = undefined;

  // # Utility Functions
  // ## Hash Address

  /*
 * Hashes as addresses, and utility functions for Kademlia-like routing.
 */
  class HashAddress {
    constructor(o) {
      if (o instanceof Uint8Array && o.length === 32) {
        this.data = o;
      } else {
        throw new Error();
      }
    }

    static async generate(src /*ArrayBuffer | String*/) {
      if (typeof src === "string") {
        src = ascii2buf(src);
      }
      let hash = await crypto.subtle.digest("SHA-256", src);
      return new HashAddress(new Uint8Array(hash));
    }

    equals(addr) {
      for (let i = 0; i < 32; ++i) {
        if (this.data[i] !== addr.data[i]) {
          return false;
        }
      }
      return true;
    }

    static async TEST_constructor_generate_equals() {
      let a = await HashAddress.generate("hello world");
      let b = await HashAddress.generate("hello world");
      let c = await HashAddress.generate("hello wørld");
      a.equals(b) || throwError("equals1");
      !a.equals(c) || throwError("equals2");
    }

    static fromUint8Array(buf) {
      return new HashAddress(buf.slice());
    }

    static fromArrayBuffer(buf) {
      return HashAddress.fromUint8Array(new Uint8Array(buf));
    }

    static fromString(str) {
      return HashAddress.fromArrayBuffer(ascii2buf(atob(str)));
    }

    static fromHex(str) {
      return HashAddress.fromArrayBuffer(hex2buf(str));
    }

    toArrayBuffer() {
      return this.data.slice().buffer;
    }

    toString() {
      return btoa(buf2ascii(this.toArrayBuffer()));
    }

    toHex() {
      return buf2hex(this.toArrayBuffer());
    }

    static async TEST_from_toArrayBuffer_toString() {
      let a = await HashAddress.generate("hello");
      let b = HashAddress.fromArrayBuffer(a.toArrayBuffer());
      let c = HashAddress.fromString(a.toString());
      let x80 = HashAddress.fromString(
        "gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      );
      a.equals(b) || throwError();
      a.equals(c) || throwError();
      x80.toHex().startsWith("800") || throwError();
    }

    /*
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

    /* 
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

    static TEST_dist() {
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
    }

    /**
   * Flip the bit at pos, and randomise every bit after that
   */
    flipBitRandomise(pos) {
      let src = new Uint8Array(this.data);
      let dst = src.slice();
      let bytepos = pos >> 3;
      crypto.getRandomValues(dst.subarray(bytepos));

      let mask = 0xff80 >> (pos & 7);
      let inverse = 0x80 >> (pos & 7);
      dst[pos >> 3] =
        (src[bytepos] & mask) | ((dst[bytepos] & ~mask) ^ inverse);

      return new HashAddress(dst);
    }

    static TEST_flipBitRandomise() {
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
    }
  }

  test(() => {
    for (const key of Object.getOwnPropertyNames(HashAddress)) {
      if (key.startsWith("TEST_")) {
        HashAddress[key]();
      }
    }
  });

  window.HA = HashAddress;

  // ## Binary Data
  function hex2buf(str) {
    let a = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
      a[i / 2] = parseInt(str.slice(i, i + 2), 16);
    }
    return a.buffer;
  }

  function buf2hex(buf) {
    let a = new Uint8Array(buf);
    let str = "";
    for (var i = 0; i < a.length; ++i) {
      str += (0x100 + a[i]).toString(16).slice(1);
    }
    return str;
  }

  function ascii2buf(str) {
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

  function buf2ascii(buf) {
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

  function getIsNodeJs() {
    return (
      typeof process !== "undefined" &&
      process.versions &&
      !!process.versions.node
    );
  }

  function throwError(msg) {
    throw new Error(msg);
  }

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

  function sleep(n) {
    return new Promise((resolve, reject) => setTimeout(resolve, n));
  }
  test(async () => {
    const t0 = Date.now();
    await sleep(100);
    const t = Date.now() - t0;
    assert(90 < t, t);
    assert(t < 110, t);
  });

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

  function getEnv() {
    /* istanbul ignore else */
    if (isNodeJs) {
      return process.env;
    } else {
      try {
        return pairsToObject(
          location.hash
            .slice(1)
            .split("&")
            .map(s => s.split("=").map(decodeURIComponent))
        );
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  }

  // ## Assert

  /* istanbul ignore next */
  function assertImpl() {
    function assert(e, msg) {
      e || throwError(msg);
    }

    assert.equal = (a, b, msg) => {
      assert(!msg);
      if (a !== b) {
        throwError(
          `${msg || "assert.equal error:"}\n${String(a)} !== ${String(
            b
          )}`
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

    return assert;
  }

  // ## Testing

  function test(f) {
    p2pweb._tests = p2pweb._tests || [];
    p2pweb._tests.push({ f });
  }
  async function runTests() {
    const testTimeout = 3000;

    console.log("Running tests...");
    let errors = 0;
    for (const test of p2pweb._tests) {
      try {
        await Promise.race([
          (async () => {
            await sleep(testTimeout);
            /* istanbul ignore next */
            throwError("timeout");
          })(),
          Promise.resolve(test.f())
        ]);
      } catch (e) {
        console.log(test.f);
        console.log(e);
        typeof process !== "undefined" && process.exit(1);
        throw e;
      }
    }
    console.log("All tests ok :)");
    typeof process !== "undefined" && process.exit(0);
  }

  // # Main

  /* istanbul ignore else */
  if (env.RUN_TESTS) {
    setTimeout(runTests, 0);
  } else {
    platform.connected = con => {
      con.onmessage = msg => console.log("msg", msg);
      con.onclose = () => console.log("close", con);
      con.send(`hello ${isNodeJs}`);
    };

    setTimeout(() => {
      const o = { close: () => {} };
      let con = platform.receiveSignalling(o);
      o.onmessage({
        data: JSON.stringify({ websocket: bootstrapNodes[0] })
      });
    }, 1000 * Math.random());
  }

  //
  // # Platform specific code
  //

  /* istanbul ignore else*/
  // ## NodeJS
  //
  if (isNodeJs) {
    const WebSocket = require("ws");

    const port = env.P2PWEB_PORT || 3535;
    const url = env.P2PWEB_URL;
    assert(url, "Missing P2PWEB_URL in environment");

    const wss = new WebSocket.Server({ port: port });
    wss.on("connection", function connection(ws) {
      const con = {
        send: msg => ws.send(msg),
        close: () => ws.close()
      };
      platform.connected(con);
      ws.on(
        "message",
        msg => con.onmessage && con.onmessage({ data: msg })
      );
      ws.on("close", () => con.onclose && con.onclose());
    });

    platform.receiveSignalling = o => {
      o.onmessage = () => {};
      return {};
    };

    platform.startSignalling = o => {
      o.send({ ws: url });
    };

    // ### Crypto shim
    window.crypto = { subtle: {} };
    crypto.subtle.digest = async function(cipher, data) {
      assert.equal(cipher, "SHA-256");
      return require("crypto")
        .createHash("sha256")
        .update(data);
    };

    crypto.getRandomValues = dst =>
      new Promise((resolve, reject) => {
        const arr = new Uint8Array(dst);
        require("crypto").randomBytes(arr.length, (err, buf) => {
          if (err) {
            return reject(err);
          } else {
            arr.set(buf);
            resolve();
          }
        });
      });
  } else {
    //
    // ## Browser or WebWorker (!isNodeJs)
    //
    platform.receiveSignalling = signalConnection => {
      signalConnection.onmessage = signalMessage => {
        signalMessage = JSON.parse(signalMessage.data);
        if (signalMessage.websocket) {
          const con = {};
          const ws = new WebSocket(signalMessage.websocket);
          con.send = msg => ws.send(msg);
          con.close = () => ws.close();
          ws.onmessage = msg => con.onmessage && con.onmessage(msg);
          ws.onerror = err => {
            con.onclose && con.onclose();
            signalConnection.close();
          };
          ws.onclose = () => con.onclose && con.onclose();
          ws.onopen = () => {
            platform.connected(con);
            signalConnection.close();
          };
        } else {
          signalConnection.close();
          throw "WebRTC not implemented yet";
        }
      };
    };
  }
  // # END OF FILE
})(typeof exports !== "undefined" ? exports : (window.p2pweb = {}));
