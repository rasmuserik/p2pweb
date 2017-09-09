// # PeerSea
//
// (literate source code below)
//
(function(p2pweb) {
  "use strict";
  //
// # Main
  //
  // # Platform Abstraction
  //
  const defaultBootstrap = 'wss://sea.solsort.com/';

  const isNodejs =
    typeof process !== "undefined" &&
    process.versions &&
    !!process.versions.node;
  const window = isNodejs ? process.global : self;

  // TODO: should be an `env` derrived from process.env or parsed location.hash
  //
  const env = getEnv();
  const bootstrapNodes = (env.SEA_BOOTSTRAP || defaultBootstrap).trim().split(/\s+/);
  const assert = isNodejs
    ? require("assert")
    : (ok, msg) => ok || throwError(msg);
  let startSignalling;
  let receiveSignalling;

  // # Utility Functions
  //
  function throwError(msg) {
    throw new Error(msg);
  }
  function tryFn(f, alt) {
    try {
      return f();
    } catch(e) {
      return typeof alt === 'function' ? alt(e) : alt;
    }
  }
  function pairsToObject(keyvals) {
    const result = {};
    for(const [key, val] of keyvals) {
      result[key] = val;
    }
    return result;
  }
  function getEnv() {
    if(isNodejs) return process.env;
    return tryFn(
      pairsToObject(location.hash.slice(1).split("&").map(s => s.split("=").map(decodeURIComponent))),
      {});
  }
  //
  // # Network Implementation
  //
  // - connection:
  //     - onmessage `{data: ...}`
  //     - send
  //     - onclose
  //     - close
  // - `startSignalling(signalling_connection)`
  // - `receiveSignalling(signalling_connection)`
  // - callback `connected(connection)`

  function connected(con) {
    con.onmessage = msg => console.log("msg", msg);
    con.onclose = () => console.log("close", con);
    con.send(`hello ${isNodejs}`);
  }

  setTimeout(() => {
    const o = { close: () => {} };
    let con = receiveSignalling(o);
    o.onmessage({
      data: JSON.stringify({ websocket: bootstrapNodes[0] })
    });
  }, 1000 * Math.random());

  // ## NodeJS
  //
  if (isNodejs) {
    const WebSocket = require("ws");

    const port = process.env.SEA_PORT;
    assert(port);

    const url = process.env.SEA_URL;
    assert(url);

    const wss = new WebSocket.Server({ port: port });

    wss.on("connection", function connection(ws) {
      const con = {
        send: msg => ws.send(msg),
        close: () => ws.close()
      };
      connected(con);
      ws.on(
        "message",
        msg => con.onmessage && con.onmessage({ data: msg })
      );
      ws.on("close", () => con.onclose && con.onclose());
    });
    receiveSignalling = o => {
      o.onmessage = () => {};
      return {};
    };
  }

  // ## Browser
  //
  if (!isNodejs) {
    receiveSignalling = signalConnection => {
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
            connected(con);
            signalConnection.close();
          };
        } else {
          signalConnection.close();
          throw "WebRTC not implemented yet";
        }
      };
    };
  }
})(typeof exports !== 'undefined' ? exports : (window.p2pweb = {}));
