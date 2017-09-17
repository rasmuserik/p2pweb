const rpc = module.exports;
const assert = require('./assert');

rpc.connect = function({con, data}) {
  const msg = data;
  this.print(
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
    this.print('already connected to', msg.addr.slice(0, 4));
    this.print(
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
  this.send(msg.addr, {rpc: 'this.print', from: this.name()});

  for (const peer of this.connections.map(o => o.addr)) {
    if (peer !== con.addr) {
      this.send(peer, {rpc: 'newPeer', addr: msg.addr});
    }
  }

  // experiment
  // TODO: remove this later
  //
  setTimeout(() => {
    const allPeers = this.allPeers();
    const randomPeer = allPeers[(Math.random() * allPeers.length) | 0];
    if (!randomPeer) {
      return this.print('no peers');
    }
    this.print('randomPeer:', randomPeer.slice(0, 4));
    if (!this.findConnection(randomPeer)) {
      this.print('connecting to randomPeer');
      this.send(randomPeer, {
        rpc: 'this.print',
        data: 'hello from ' + this.name()
      });

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
          msg.con = signalChannel;
          console.log('signalChannel start msg', msg.data);
        }
      };
      this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg);

      signalChannel.send('hello');
    } else {
      this.print('already connected to randomPeer');
    }
  }, 2000);
};

rpc.handleSignalConnection = function(msg) {
  const peer = msg.data.peer;
  const rpcEndpoint = msg.data.endpoint;
  assert(rpcEndpoint.startsWith('signal'));

  this.print('handleSignalConnection', msg.data.data);

  const signalChannel = {
    close: () => delete this.rpc[rpcEndpoint],
    send: data => this.send(peer, {rpc: rpcEndpoint, data: data}),
    onmessage: msg => {
      msg.con = signalChannel;
      console.log('signalChannel receive msg', msg.data);
      msg.con.send('hello2');
    }
  };
  this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg);
  signalChannel.send('hi');
};

rpc.lostPeer = function(msg) {
  this.print(
    'lostPeer',
    msg.con.addr.slice(0, 4),
    msg.data.addr.slice(0, 4)
  );
  this.findConnection(msg.con.addr).peers.filter(
    o => o.addr !== msg.data.addr
  );
};

rpc.newPeer = function(msg) {
  this.print(
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
  this.print('this.print', JSON.stringify(msg.data));
};
