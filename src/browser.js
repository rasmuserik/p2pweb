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

networkAbstraction.startSignalling = () => {}; // TODO

require("./main")(networkAbstraction);
