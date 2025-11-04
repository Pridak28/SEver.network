const WebSocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 6001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const MESSAGE_TYPES = { CHAIN: "CHAIN", TRANSACTION: "TRANSACTION" };
let sockets = [];

// Initialize P2P server
function initP2PServer(blockchain) {
  const server = new WebSocket.Server({ port: P2P_PORT });
  server.on("connection", (ws) => initConnection(ws, blockchain));
  console.log(`Listening for P2P connections on: ${P2P_PORT}`);
}

// Connect to peers from env
function connectToPeers(blockchain) {
  peers.forEach((peer) => {
    const ws = new WebSocket(peer);
    ws.on("open", () => initConnection(ws, blockchain));
  });
}

function initConnection(ws, blockchain) {
  sockets.push(ws);
  messageHandler(ws, blockchain);
  // send current chain
  ws.send(
    JSON.stringify({ type: MESSAGE_TYPES.CHAIN, data: blockchain.chain })
  );
}

function messageHandler(ws, blockchain) {
  ws.on("message", (message) => {
    const { type, data } = JSON.parse(message);
    switch (type) {
      case MESSAGE_TYPES.CHAIN:
        blockchain.replaceChain(data);
        break;
      case MESSAGE_TYPES.TRANSACTION:
        blockchain.addTransaction(data);
        break;
    }
  });
}

// Broadcast updated chain to all peers
function broadcastChain(chain) {
  sockets.forEach((ws) =>
    ws.send(JSON.stringify({ type: MESSAGE_TYPES.CHAIN, data: chain }))
  );
}

// Broadcast new transaction to all peers
function broadcastTransaction(transaction) {
  sockets.forEach((ws) =>
    ws.send(
      JSON.stringify({ type: MESSAGE_TYPES.TRANSACTION, data: transaction })
    )
  );
}

module.exports = {
  initP2PServer,
  connectToPeers,
  broadcastChain,
  broadcastTransaction,
};
