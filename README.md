#

<img src=https://forsider.solsort.com/icon.png width=96 height=96 align=right>

[![website](https://img.shields.io/badge/website-p2pweb.solsort.com-blue.svg)](https://p2pweb.solsort.com/)
[![github](https://img.shields.io/badge/github-solsort/p2pweb-blue.svg)](https://github.com/solsort/p2pweb)
[![travis](https://img.shields.io/travis/solsort/p2pweb.svg)](https://travis-ci.org/solsort/p2pweb)
[![npm](https://img.shields.io/npm/v/p2pweb.svg)](https://www.npmjs.com/package/p2pweb)

# P2P Web



This is a library for building peer-to-peer web applications.

**Under development**

(literate source code below)

    (function(p2pweb) {
      "use strict";

# Environment

      const defaultBootstrap = "wss://sea.solsort.com/";
      const isNodeJs = getIsNodeJs();
      const window = isNodeJs ? process.global : self;
      const env = getEnv();
      const bootstrapNodes = (env.SEA_BOOTSTRAP || defaultBootstrap)
        .trim()
        .split(/\s+/);
      const assert = isNodeJs ? require("assert") : assertImpl;
      const networkAbstraction = {
        startSignalling: () => throwError("startSignalling missing"),
        receiveSignalling: () => throwError("receiveSignalling missing"),
        connection: () => throwError("connection missing")
      };

# Utility Functions

      function getIsNodeJs() {
        return (
          typeof process !== "undefined" &&
          process.versions &&
          !!process.versions.node
        );
      }
      function assertImpl(e, msg) {
        e || throwError(msg);
      }
      assertImpl.equal = (a, b, msg) =>
        a === b ||
        throwError(
          `${msg || "assert.equal error:"}\n${String(a)} !== ${String(b)}`
        );
    
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
        return new Promise(resolve => setTimeout(resolve, n));
      }
      function pairsToObject(keyvals) {
        const result = {};
        for (const [key, val] of keyvals) {
          result[key] = val;
        }
        return result;
      }
      function getEnv() {
        if (isNodeJs) return process.env;
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

## Testing

      function test(msg, f) {
        if (typeof msg === "function") {
          f = msg;
          msg = "";
        }
        p2pweb._tests = p2pweb._tests || [];
        p2pweb._tests.push({ f, msg });
      }
      async function runTests() {
        const testTimeout = 3000;
    
        console.log("Running tests...");
        let errors = 0;
        for (const test of p2pweb._tests) {
          try {
            await Promise.race([
              async () => (await sleep(testTimeout), throwError("timeout")),
              Promise.resolve(test.f())
            ]);
          } catch (e) {
            console.log(test.f);
            console.log(`error from "${test.msg}"`);
            throw e;
          }
        }
        console.log("All tests ok :)");
        typeof process !== "undefined" && process.exit(0);
      }
      if (env.RUN_TESTS) {
        setTimeout(runTests, 0);
      }
    
#
    
      networkAbstraction.connected = con => {
        con.onmessage = msg => console.log("msg", msg);
        con.onclose = () => console.log("close", con);
        con.send(`hello ${isNodeJs}`);
      };
    
      setTimeout(() => {
        const o = { close: () => {} };
        let con = networkAbstraction.receiveSignalling(o);
        o.onmessage({
          data: JSON.stringify({ websocket: bootstrapNodes[0] })
        });
      }, 1000 * Math.random());
    

# Network Abstraction Implementation

    
## NodeJS

      if (isNodeJs) {
        const WebSocket = require("ws");
    
        const port = env.SEA_PORT;
        assert(port);
    
        const url = env.SEA_URL;
        assert(url);
    
        const wss = new WebSocket.Server({ port: port });
    
        wss.on("connection", function connection(ws) {
          const con = {
            send: msg => ws.send(msg),
            close: () => ws.close()
          };
          networkAbstraction.connected(con);
          ws.on(
            "message",
            msg => con.onmessage && con.onmessage({ data: msg })
          );
          ws.on("close", () => con.onclose && con.onclose());
        });
        networkAbstraction.receiveSignalling = o => {
          o.onmessage = () => {};
          return {};
        };
      } else {

## Browser or WebWorker (!isNodeJs)

        networkAbstraction.receiveSignalling = signalConnection => {
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
                networkAbstraction.connected(con);
                signalConnection.close();
              };
            } else {
              signalConnection.close();
              throw "WebRTC not implemented yet";
            }
          };
        };
      }
# END OF FILE
    })(typeof exports !== "undefined" ? exports : (window.p2pweb = {}));
