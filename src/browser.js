const window = require('./window');
const networkAbstraction = {};
function connectWebSocket(url) {
  const con = {};
  const ws = new window.WebSocket(url);
  con.send = msg => ws.send(JSON.stringify(msg));
  con.close = () => ws.close();
  ws.onmessage = msg => {
    con.onmessage &&
      con.onmessage({data: JSON.parse(msg.data), con: con});
  };
  ws.onerror = e => {
    con.onclose && con.onclose();
  };
  ws.onclose = () => con.onclose && con.onclose();
  ws.onopen = () => {
    networkAbstraction.onconnection(con);
  };
}

networkAbstraction.receiveSignalling = signalConnection => {
  signalConnection.onmessage = signalMessage => {
    signalMessage = signalMessage.data;
    if (signalMessage.websocket) {
      connectWebSocket(signalMessage.websocket);
    } else {
      signalConnection.close();
      throw new Error('WebRTC not implemented yet');
      // TODO
    }
  };
};

networkAbstraction.startSignalling = () => {}; // TODO

require('./main')({networkAbstraction});
