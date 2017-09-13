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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const networkAbstraction = {};
function connectWebSocket(url) {
  const con = {};
  const ws = new WebSocket(url);
  con.send = msg => ws.send(JSON.stringify(msg));
  con.close = () => ws.close();
  ws.onmessage = msg => {
    con.onmessage &&
      con.onmessage({ data: JSON.parse(msg.data), con: con });
  };
  ws.onerror = err => {
    con.onclose && con.onclose();
    signalConnection.close();
  };
  ws.onclose = () => con.onclose && con.onclose();
  ws.onopen = () => {
    networkAbstraction.onconnection(con);
    signalConnection.close();
  };
}

networkAbstraction.receiveSignalling = signalConnection => {
  signalConnection.onmessage = signalMessage => {
    signalMessage = signalMessage.data;
    if (signalMessage.websocket) {
      connectWebSocket(signalMessage.websocket);
    } else {
      signalConnection.close();
      throw "WebRTC not implemented yet";
      // TODO
    }
  };
};

networkAbstraction.startSignalling = () => {} // TODO

__webpack_require__(2)(networkAbstraction);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

assert = __webpack_require__(3);
module.exports = (networkAbstraction) => {
  assert(networkAbstraction);
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

  function assert(e, msg) {
    if(!e) {
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=p2pweb.js.map