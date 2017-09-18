(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* istanbul ignore else */
if (typeof self === 'undefined') {
  module.exports = {};
} else {
  module.exports = self;
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
    */

const window = __webpack_require__(0);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const window = __webpack_require__(0);
const networkAbstraction = {};
networkAbstraction.receiveSignalling = signalConnection => {
  signalConnection.onmessage = signalMessage => {
    signalMessage = signalMessage.data;
    if (signalMessage.websocket) {
      connectWebSocket(signalMessage.websocket);
    } else if (signalMessage.webrtc) {
      // TODO signalConnection.close();
      receiveSignalling(signalConnection, signalMessage.webrtc);
    } else {
      console.log('unexpected signalMessage', signalMessage);
      throw new Error('signalMessage protocol error');
    }
  };
};
networkAbstraction.startSignalling = signalConnection => {
  // TODO signalConnection.close();
  startSignalling(signalConnection);
};

function connectWebSocket(url) {
  const con = {};
  const ws = new window.WebSocket(url);
  con.send = msg => ws.send(JSON.stringify(msg));
  con.close = () => ws.close();
  ws.onmessage = msg => {
    con.onmessage &&
      con.onmessage({data: JSON.parse(msg.data), con: con});
  };
  ws.onerror = e => {
    con.onclose && con.onclose();
  };
  ws.onclose = () => con.onclose && con.onclose();
  ws.onopen = () => {
    networkAbstraction.onconnection(con);
  };
}
// WEBRTC

let iceServers = [
  'stun.l.google.com:19302',
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
  'stun01.sipphone.com',
  'stun.ekiga.net',
  'stun.fwdnet.net',
  'stun.ideasip.com',
  'stun.iptel.org',
  'stun.rixtelecom.se',
  'stun.schlund.de',
  'stunserver.org',
  'stun.softjoys.com',
  'stun.voiparound.com',
  'stun.voipbuster.com',
  'stun.voipstunt.com',
  'stun.voxgratia.org',
  'stun.xten.com'
];
iceServers = iceServers.map(s => ({url: 'stun:' + s}));

async function startSignalling(sc) {
  sc.con = new window.RTCPeerConnection({iceServers: iceServers});
  sc.con.onicecandidate = iceHandler(sc);
  sc.con.onerror = e => console.log(e);

  sc.chan = sc.con.createDataChannel('sendChannel');
  addChanHandlers(sc);
  const offer = await sc.con.createOffer();
  sc.con.setLocalDescription(offer);
  sc.send({webrtc: offer});
  console.log('startSignalling', offer);
  sc.onmessage = answer => {
    console.log('got answer:', answer);
    sc.con.setRemoteDescription(answer.data);

    sc.onmessage = ice => {
      console.log('add ice', ice);
      sc.con.addIceCandidate(ice.data);
    };
  };
}
async function receiveSignalling(sc, offer) {
  sc.con = new window.RTCPeerConnection({iceServers: iceServers});
  sc.con.onicecandidate = iceHandler(sc);
  sc.con.onerror = e => console.log(e);

  console.log('receiveSignalling', offer);
  sc.con.ondatachannel = ev => {
    sc.chan = ev.channel;
    addChanHandlers(sc);
  };
  sc.onmessage = ice => {
    console.log('add ice', ice);
    sc.con.addIceCandidate(ice.data);
  };
  await sc.con.setRemoteDescription(offer);
  const answer = await sc.con.createAnswer();
  sc.con.setLocalDescription(answer);
  sc.send(answer);
}
function iceHandler(sc) {
  return ev => {
    if (ev.candidate) {
      sc.send(ev.candidate);
    }
  };
}
function addChanHandlers(sc) {
  console.log('addChanHandlers');
  sc.chan.onopen = () => {
    console.log('sc.chan.onopen', sc);
    const con = {
      send: msg => sc.chan.send(JSON.stringify(msg))
      // TODO close
    };
    sc.chan.onmessage = msg => {
      console.log('webrtc message', msg.data);
      con.onmessage &&
        con.onmessage({
          con: con,
          data: JSON.parse(msg.data)
        });
    };
    networkAbstraction.onconnection(con);
  };
}

__webpack_require__(5)({networkAbstraction});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(1);
const Node = __webpack_require__(6);
const {getEnv, unique} = __webpack_require__(2);

module.exports = ({networkAbstraction}) => {
  let bootstrapNodes = getEnv().P2PWEB_BOOTSTRAP;
  bootstrapNodes = Array.isArray(bootstrapNodes)
    ? bootstrapNodes
    : [bootstrapNodes];
  console.log('hello from main', networkAbstraction, bootstrapNodes);
  assert(networkAbstraction);
  const node = new Node({bootstrapNodes, networkAbstraction});
  networkAbstraction.onconnection = con => {
    node.addConnection(con);
  };
  setInterval(() => {
    node.connections.map(o => o.addr).forEach(addr => {
      node.send(addr, {
        rpc: 'print',
        data: 'hello from ' + node.name()
      });
    });
  }, 3000);
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const HashAddress = __webpack_require__(7);
const rpc = __webpack_require__(8);
const {pairsToObject, sleep} = __webpack_require__(2);
const window = __webpack_require__(0);

let nodes = [];
let printLines = [];

/**
  */
module.exports = class Node {
  /**
    */
  constructor({bootstrapNodes, networkAbstraction}) {
    nodes.push(this);

    this.bootstrapNodes = bootstrapNodes;
    this.networkAbstraction = networkAbstraction;
    this.connections = [];
    this.rpc = {};

    for (const method in rpc) {
      this.rpc[method] = rpc[method].bind(this);
    }

    (async () => {
      console.log('a');
      await sleep(0);
      // TODO generate through DSA-key here later (bad random for the moment).
      this.myAddress = await HashAddress.generate(
        String(Math.random())
      );
      this.log('here', networkAbstraction);
      this.bootstrap();
    })();
  }

  /**
     * List of all known peers (one hop from current node)
     */
  allPeers() {
    let peers = Object.keys(
      pairsToObject(
        this.connections
          .map(o => o.addr)
          .concat.apply([], this.connections.map(o => o.peers))
          .map(s => [s, true])
      )
    ).filter(o => o !== this.address().toString());
    return peers;
  }

  /**
     * @private
    */
  bootstrap() {
    if (!this.bootstrapping && this.connections.length === 0) {
      this.bootstrapping = true;
      setTimeout(() => {
        this.bootstrapping = false;
        this.bootstrap();
      }, 1000);

      const o = {close: () => {}};
      this.networkAbstraction.receiveSignalling(o);
      o.onmessage({
        data: {
          websocket: this.bootstrapNodes[
            (Math.random() * this.bootstrapNodes.length) | 0
          ]
        }
      });
    }
  }

  /**
    */
  send(addr, msg) {
    const c = this.findConnection(addr);
    if (c) {
      c.con.send(msg);
    } else if (this.address().toString() === addr) {
      this.local(msg);
    } else if (this.allPeers().includes(addr)) {
      for (const peer of this.connections) {
        if (peer.peers.includes(addr)) {
          peer.con.send({rpc: 'relay', dst: addr, data: msg});
          break;
        }
      }
    } else {
      this.log('no connection to ' + String(addr).slice(0, 4), msg);
      this.log(this.allPeers().map(s => s.slice(0, 4)));
      throw new Error();
    }
  }

  /**
    */
  local(msg) {
    if (this.rpc[msg.data.rpc]) {
      try {
        this.rpc[msg.data.rpc](msg);
      } catch (e) {
        this.log('error calling endpoint:', msg.data.rpc);
        this.log(e);
      }
    } else {
      this.log('no such endpoint ' + JSON.stringify(msg.data));
    }
  }

  /**
    */
  findConnection(addr) {
    return this.connections.find(o => o.addr === addr);
  }

  /**
    */
  address() {
    return this.myAddress;
  }

  /**
    */
  name() {
    return this.address()
      .toString()
      .slice(0, 4);
  }

  /**
    */
  addConnection(con) {
    const peer = {con};
    peer.con.onmessage = msg => this.local(msg);

    peer.con.onclose = () => {
      const addr = (this.connections.find(o => o.con === peer.con) ||
        {}).addr;
      this.connections = this.connections.filter(
        o => o.con !== peer.con
      );
      this.log('close', (con.addr || '????').slice(0, 4));

      if (addr) {
        for (const peer of this.connections.map(o => o.addr)) {
          this.send(peer, {rpc: 'lostPeer', addr: addr});
        }
      }
    };

    peer.con.t2 = Date.now() + Math.random();
    peer.con.send({
      time: peer.con.t2,
      weigh: 1 + Math.random(),
      rpc: 'connect',
      addr: this.address().toString(),
      peers: this.connections.map(o => o.addr),
      agent: window.navigator.userAgent
    });
    this.log('addconnection', this.connections);
  }

  log() {
    const line = [this.name()].concat(Array.from(arguments));
    if (
      window.document &&
      window.document.getElementById('p2pweb-log')
    ) {
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
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const window = __webpack_require__(0);
const assert = __webpack_require__(1);
const {ascii2buf, buf2ascii, hex2buf, buf2hex} = __webpack_require__(2);

/**
 * Hashes as addresses, and utility functions for Kademlia-like routing.
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
    */
  static async generate(src /*ArrayBuffer | String*/) {
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const rpc = module.exports;
const assert = __webpack_require__(1);
rpc.connect = function({con, data}) {
  const msg = data;
  this.log(
    'connect',
    msg.addr.slice(0, 4),
    msg.peers.map(s => s.slice(0, 4))
  );
  con.t2 += msg.time;
  const peer = con;
  peer.addr = msg.addr;
  peer.con = con;
  peer.peers = msg.peers;
  if (this.findConnection(msg.addr)) {
    this.log('already connected to', msg.addr.slice(0, 4));
    this.log(
      'timestamps for consitent cleanup (not implemented yet)',
      con.t2,
      msg.time,
      this.findConnection(msg.addr).con.t2
    );
    //
    // TODO: cleanup duplicate connections made at the same time
    //
    this.connections.push(con);
    return;
  }
  this.connections.push(con);
  this.send(msg.addr, {rpc: 'print', from: this.name()});
  for (const peer of this.connections.map(o => o.addr)) {
    if (peer !== con.addr) {
      this.send(peer, {rpc: 'newPeer', addr: msg.addr});
    }
  }
  // experiment: TODO: remove this later
  setTimeout(() => {
    const allPeers = this.allPeers();
    const randomPeer = allPeers[(Math.random() * allPeers.length) | 0];
    if (!randomPeer) {
      return this.log('no peers');
    }
    this.log('randomPeer:', randomPeer.slice(0, 4));
    if (!this.findConnection(randomPeer)) {
      this.log('connecting to', randomPeer.slice(0, 4));

      const peer = randomPeer;
      const rpcEndpoint =
        'signal' +
        Math.random()
          .toString()
          .slice(2);
      this.send(peer, {
        rpc: 'handleSignalConnection',
        endpoint: rpcEndpoint,
        peer: this.address().toString()
      });

      const signalChannel = {
        close: () => delete this.rpc[rpcEndpoint],
        send: data => this.send(peer, {rpc: rpcEndpoint, data: data}),
        onmessage: msg => {
          this.log('signalChannel start msg', msg);
          msg.con = signalChannel;
        }
      };
      this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg.data);
      this.networkAbstraction.startSignalling(signalChannel);
    } else {
      this.log('already connected to randomPeer');
    }
  }, 2000);
};
rpc.handleSignalConnection = function(msg) {
  const peer = msg.data.peer;
  const rpcEndpoint = msg.data.endpoint;
  assert(rpcEndpoint.startsWith('signal'));

  this.log('handleSignalConnection', msg.data);

  const signalChannel = {
    close: () => delete this.rpc[rpcEndpoint],
    send: data => this.send(peer, {rpc: rpcEndpoint, data: data}),
    onmessage: msg => {
      this.log('signalChannel receive msg', msg.data);
      msg.con = signalChannel;
    }
  };
  this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg.data);
  this.networkAbstraction.receiveSignalling(signalChannel);
};
rpc.lostPeer = function(msg) {
  this.log(
    'lostPeer',
    msg.con.addr.slice(0, 4),
    msg.data.addr.slice(0, 4)
  );
  this.findConnection(msg.con.addr).peers.filter(
    o => o.addr !== msg.data.addr
  );
};
rpc.newPeer = function(msg) {
  this.log(
    'newPeer',
    msg.con.addr.slice(0, 4),
    msg.data.addr.slice(0, 4)
  );
  this.findConnection(msg.con.addr).peers.push(msg.data.addr);
};
rpc.relay = function(msg) {
  this.send(msg.data.dst, msg.data.data);
};
rpc.print = function(msg) {
  this.log('this.log', JSON.stringify(msg.data));
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=p2pweb.js.map