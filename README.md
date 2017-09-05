    (function () {
      'use strict';
# Platform Abstraction
    
      const default_bootstrap = `
    wss://sea.solsort.com/
    `;
    
      const is_nodejs = typeof process !== 'undefined' && process.versions && !!process.versions.node;
      const window = is_nodejs ? process.global : self;
      const bootstrap_nodes = ((is_nodejs && process.env.SEA_BOOTSTRAP) || (window.location && window.location.hash && window.location.hash.includes('SEA_BOOTSTRAP=') && decodeURIComponent(window.location.hash.replace(/.*SEA_BOOTSTRAP=/).replace(/[&].*/))) || default_bootstrap).trim().split(/\W+/);
    
    
      /*
    const sea = require('./sea');
    const WebSocket = require('ws');
    
    const port = process.env.SEA_PORT || 3535;
    const url = process.env.SEA_URL || 'http://localhost:' + port;
    
    const wss = new WebSocket.Server({ port: 3535});
    
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
    
      ws.send('something');
    });
    const bootstrap_nodes = self.SEA_BOOTSTRAP || [];
    console.log(bootstrap_nodes);
    */
Hello
    })();
    
    
