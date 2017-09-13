const rpc = {};

rpc.connect = function({ con, data }) {
  const msg = data;
  print(
    "connect",
    msg.addr.slice(0, 4),
    msg.peers.map(s => s.slice(0, 4))
  );

  con.t2 += msg.time;

  const peer = con;
  peer.addr = msg.addr;
  peer.con = con;
  peer.peers = msg.peers;

  if (this.findConnection(msg.addr)) {
    print("already connected to", msg.addr.slice(0, 4));
    print(
      "timestamps for consitent cleanup (not implemented yet)",
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
  this.send(msg.addr, { rpc: "print", from: this.name() });

  for (const peer of this.connections.map(o => o.addr)) {
    if (peer !== con.addr) {
      this.send(peer, { rpc: "newPeer", addr: msg.addr });
    }
  }

  // experiment
  // TODO: remove this later
  //
  setTimeout(() => {
    const allPeers = this.allPeers();
    const randomPeer = allPeers[(Math.random() * allPeers.length) | 0];
    if (!randomPeer) {
      return print("no peers");
    }
    print("randomPeer:", randomPeer.slice(0, 4));
    if (!this.findConnection(randomPeer)) {
      print("connecting to randomPeer");
      this.send(randomPeer, {
        rpc: "print",
        data: "hello from " + this.name()
      });

      const peer = randomPeer;
      const rpcEndpoint =
        "signal" +
        Math.random()
          .toString()
          .slice(2);
      const handleMessage = msg =>
        console.log("handleMessage", msg.data);
      this.send(peer, {
        rpc: "handleSignalConnection",
        endpoint: rpcEndpoint,
        peer: this.address().toString()
      });

      const signalChannel = {
        close: () => delete this.rpc[rpcEndpoint],
        send: data => this.send(peer, { rpc: rpcEndpoint, data: data }),
        onmessage: msg => {
          msg.con = signalChannel;
          console.log("signalChannel start msg", msg.data);
        }
      };
      this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg);

      signalChannel.send("hello");
    } else {
      print("already connected to randomPeer");
    }
  }, 2000);
};

rpc.handleSignalConnection = function(msg) {
  const peer = msg.data.peer;
  const rpcEndpoint = msg.data.endpoint;
  assert(rpcEndpoint.startsWith("signal"));

  print("handleSignalConnection", msg.data.data);

  const signalChannel = {
    close: () => delete this.rpc[rpcEndpoint],
    send: data => this.send(peer, { rpc: rpcEndpoint, data: data }),
    onmessage: msg => {
      msg.con = signalChannel;
      console.log("signalChannel receive msg", msg.data);
      msg.con.send("hello2");
    }
  };
  this.rpc[rpcEndpoint] = msg => signalChannel.onmessage(msg);
  signalChannel.send("hi");
};

rpc.lostPeer = function(msg) {
  //msg.con.peers.filter(o => o.addr !== msg.data.addr);
  print(
    "lostPeer",
    msg.con.addr.slice(0, 4),
    msg.data.addr.slice(0, 4)
  );
  this.findConnection(msg.con.addr).peers.filter(
    o => o.addr !== msg.data.addr
  );
  //print(msg.con.peers);
};

rpc.newPeer = function(msg) {
  //msg.con.peers.push({addr: msg.data.addr});
  print("newPeer", msg.con.addr.slice(0, 4), msg.data.addr.slice(0, 4));
  this.findConnection(msg.con.addr).peers.push(msg.data.addr);
  //print(msg.con.peers);
};

rpc.relay = function(msg) {
  this.send(msg.data.dst, msg.data.data);
};

rpc.print = function(msg) {
  print("print", JSON.stringify(msg.data));
};
