// # PeerSea
//
// (literate source code below)
//
(function() {
  "use strict";
  //
  // # Platform Abstraction
  //
  const default_bootstrap = `
wss://sea.solsort.com/
`;

  const is_nodejs =
    typeof process !== "undefined" &&
    process.versions &&
    !!process.versions.node;
  const window = is_nodejs ? process.global : self;

  // TODO: should be an `env` derrived from process.env or parsed location.hash
  const bootstrap_nodes = ((is_nodejs && process.env.SEA_BOOTSTRAP) ||
    (window.location &&
      window.location.hash &&
      window.location.hash.includes("SEA_BOOTSTRAP=") &&
      decodeURIComponent(
        window.location.hash
          .replace(/.*SEA_BOOTSTRAP=/, "")
          .replace(/[&].*/, "")
      )) ||
    default_bootstrap)
    .trim()
    .split(/\s+/);

  console.log("bootstrap nodes:", bootstrap_nodes);

  const assert = is_nodejs
    ? require("assert")
    : (ok, msg) => {
        if (!ok) throw new Error("assert: " + msg);
      };

  // ## Network
  //
  // - connection:
  //     - onmessage `{data: ...}`
  //     - send
  //     - onclose
  //     - close
  // - `start_signalling(signalling_connection)`
  // - `receive_signalling(signalling_connection)`
  // - callback `connected(connection)`

  function connected(con) {
    con.onmessage = msg => console.log("msg", msg);
    con.onclose = () => console.log("close", con);
    con.send(`hello ${is_nodejs}`);
  }
  let start_signalling;
  let receive_signalling;

  setTimeout(() => {
    const o = { close: () => {} };
    let con = receive_signalling(o);
    o.onmessage({
      data: JSON.stringify({ websocket: bootstrap_nodes[0] })
    });
  }, 1000 * Math.random());

  // ### NodeJS
  //
  if (is_nodejs) {
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
    receive_signalling = o => {
      o.onmessage = () => {};
      return {};
    };
  }

  // ### Browser
  //
  if (!is_nodejs) {
    receive_signalling = signal_connection => {
      signal_connection.onmessage = signal_message => {
        signal_message = JSON.parse(signal_message.data);
        if (signal_message.websocket) {
          const con = {};
          const ws = new WebSocket(signal_message.websocket);
          con.send = msg => ws.send(msg);
          con.close = () => ws.close();
          ws.onmessage = msg => con.onmessage && con.onmessage(msg);
          ws.onerror = err => {
            con.onclose && con.onclose();
            signal_connection.close();
          }
          ws.onclose = () => con.onclose && con.onclose();
          ws.onopen = () => {
            connected(con);
            signal_connection.close();
          };
        } else {
          signal_connection.close();
          throw "WebRTC not implemented yet";
        }
      };
    };
  }
})();
