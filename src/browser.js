const window = require('./window');
const networkAbstraction = {};
networkAbstraction.receiveSignalling = signalConnection => {
  signalConnection.onmessage = signalMessage => {
    signalMessage = signalMessage.data;
    if (signalMessage.websocket) {
      connectWebSocket(signalMessage.websocket);
    } else if (signalMessage.webrtc) {
      // TODO signalConnection.close();
      receiveSignalling(signalConnection, signalMessage.webrtc);
    } else {
      console.log('unexpected signalMessage', signalMessage);
      throw new Error('signalMessage protocol error');
    }
  };
};
networkAbstraction.startSignalling = signalConnection => {
  // TODO signalConnection.close();
  startSignalling(signalConnection);
};

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
// WEBRTC

let iceServers = [
  'stun.l.google.com:19302',
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
  'stun01.sipphone.com',
  'stun.ekiga.net',
  'stun.fwdnet.net',
  'stun.ideasip.com',
  'stun.iptel.org',
  'stun.rixtelecom.se',
  'stun.schlund.de',
  'stunserver.org',
  'stun.softjoys.com',
  'stun.voiparound.com',
  'stun.voipbuster.com',
  'stun.voipstunt.com',
  'stun.voxgratia.org',
  'stun.xten.com'
];
iceServers = iceServers.map(s => ({url: 'stun:' + s}));

async function startSignalling(sc) {
  sc.con = new window.RTCPeerConnection({iceServers: iceServers});
  sc.con.onicecandidate = iceHandler(sc);
  sc.con.onerror = e => console.log(e);

  sc.chan = sc.con.createDataChannel('sendChannel');
  addChanHandlers(sc);
  const offer = await sc.con.createOffer();
  sc.con.setLocalDescription(offer);
  sc.send({webrtc: offer});
  console.log('startSignalling', offer);
  sc.onmessage = answer => {
    console.log('got answer:', answer);
    sc.con.setRemoteDescription(answer.data);

    sc.onmessage = ice => {
      console.log('add ice', ice);
      sc.con.addIceCandidate(ice.data);
    };
  };
}
async function receiveSignalling(sc, offer) {
  sc.con = new window.RTCPeerConnection({iceServers: iceServers});
  sc.con.onicecandidate = iceHandler(sc);
  sc.con.onerror = e => console.log(e);

  console.log('receiveSignalling', offer);
  sc.con.ondatachannel = ev => {
    sc.chan = ev.channel;
    addChanHandlers(sc);
  };
  sc.onmessage = ice => {
    console.log('add ice', ice);
    sc.con.addIceCandidate(ice.data);
  };
  await sc.con.setRemoteDescription(offer);
  const answer = await sc.con.createAnswer();
  sc.con.setLocalDescription(answer);
  sc.send(answer);
}
function iceHandler(sc) {
  return ev => {
    if (ev.candidate) {
      sc.send(ev.candidate);
    }
  };
}
function addChanHandlers(sc) {
  console.log('addChanHandlers');
  sc.chan.onopen = () => {
    console.log('sc.chan.onopen', sc);
    const con = {
      send: msg => sc.chan.send(JSON.stringify(msg))
      // TODO close
    };
    sc.chan.onmessage = msg => {
      console.log('webrtc message', msg.data);
      con.onmessage &&
        con.onmessage({
          con: con,
          data: JSON.parse(msg.data)
        });
    };
    networkAbstraction.onconnection(con);
  };
}

require('./main')({networkAbstraction});
