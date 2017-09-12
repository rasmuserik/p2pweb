// # Node
HashAddress = require('./HashAddress');

let nodes = [];
/**
  */
this.exports = class Node {
  /**
    */
  constructor({ bootstrapNodes }) {
    nodes.push(this);

    this.bootstrapNodes = bootstrapNodes;
    this.connections = [];
    this.rpc = {};

    for (const method in rpc) {
      this.rpc[method] = rpc[method].bind(this);
    }

    (async () => {
      // TODO generate through DSA-key here later (bad random for the moment).
      this.myAddress = await HashAddress.generate(
        String(Math.random())
      );
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

      const o = { close: () => {} };
      platform.receiveSignalling(o);
      o.onmessage({
        data: {
          websocket:
            bootstrapNodes[(Math.random() * bootstrapNodes.length) | 0]
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
          peer.con.send({ rpc: "relay", dst: addr, data: msg });
          break;
        }
      }
    } else {
      print("no connection to " + String(addr).slice(0, 4), msg);
      print(this.allPeers().map(s => s.slice(0, 4)));
      throw new Error();
    }
  }

  /**
    */
  local(msg) {
    if (this.rpc[msg.data.rpc]) {
      this.rpc[msg.data.rpc](msg);
    } else {
      print("no such endpoint " + JSON.stringify(msg.data));
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
    let name = "";

    const peer = { con };
    peer.con.onmessage = msg => this.local(msg);

    peer.con.onclose = () => {
      const addr = (this.connections.find(o => o.con === peer.con) ||
        {}).addr;
      this.connections = this.connections.filter(
        o => o.con !== peer.con
      );
      print("close", (con.addr || "????").slice(0, 4));

      if (addr) {
        for (const peer of this.connections.map(o => o.addr)) {
          this.send(peer, { rpc: "lostPeer", addr: addr });
        }
      }
    };

    peer.con.t2 = Date.now() + Math.random();
    peer.con.send({
      time: peer.con.t2,
      weigh: 1 + Math.random(),
      rpc: "connect",
      addr: this.address().toString(),
      peers: this.connections.map(o => o.addr),
      isNodeJs: isNodeJs
    });
    print("addconnection");
  }
}
