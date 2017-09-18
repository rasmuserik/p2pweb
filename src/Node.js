const HashAddress = require('./HashAddress');
const rpc = require('./rpc');
const {pairsToObject, sleep} = require('./util');
const window = require('./window');

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
