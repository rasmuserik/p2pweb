require("./shims-nodejs");
const assert = require("./assert");

const networkAbstraction = {};

const WebSocket = require("ws");

const port = env.P2PWEB_PORT || 3535;
const url = env.P2PWEB_URL || "ws://localhost:3535"; // TODO no default
assert(url, "Missing P2PWEB_URL in environment");
const wss = new WebSocket.Server({ port: port });
wss.on("connection", function connection(ws) {
  const con = {
    send: msg => ws.send(JSON.stringify(msg)),
    close: () => {
      ws.close();
      ws.emit("close");
    }
  };
  networkAbstraction.onconnection(con);
  ws.on(
    "message",
    msg =>
      con.onmessage &&
      con.onmessage({ data: JSON.parse(msg), con: con })
  );
  ws.on("close", () => con.onclose && con.onclose());
});

networkAbstraction.receiveSignalling = o => {
  o.onmessage = msg => {
    msg = msg.data;
    if (msg.websocket) {
      const ws = new WebSocket(msg.websocket);
      const con = {
        outgoing: [],
        send: msg => con.outgoing.push(msg),
        close: () => ws.close()
      };
      ws.on("open", () => {
        con.send = msg => ws.send(JSON.stringify(msg));
        con.outgoing.forEach(con.send);
        delete con.outgoing;
        networkAbstraction.onconnection(con);
      });
      ws.on(
        "message",
        msg =>
          con.onmessage && con.onmessage({ data: JSON.parse(msg), con })
      );
      ws.on("error", () => {
        print("could not connect to " + msg.websocket);
      });
    } else {
      o.send({ websocket: url });
    }
  };
  return {};
};

networkAbstraction.startSignalling = o => {
  o.send({ websocket: url });
};

process.on("exit", () => wss.close());

require("./main")(networkAbstraction);
