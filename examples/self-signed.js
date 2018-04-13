const fs = require('fs');
const Socket = require('../dist/socket').Socket;

const tlsCallback = {
  onClose: (e) => {
    console.log('onClose', e);
  },
  onTimeout: (e) => {
    console.log('onTimeout', e);
  },
  onData: (chunk) => {
    console.log('onData', JSON.parse(chunk));
  },
  onEnd: (e) => {
    console.log('onEnd', e);
  },
  onError: (e) => {
    console.log('onError', e);
  },
  onSocketConnection: async (socket) => {
    console.log(socket.authorized);
    Socket.request(socket, 'blockchain.address.get_balance', ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']);
  },
};

Socket.tlsSocket('185.64.116.15', 50002, tlsCallback, {
  ca: [ fs.readFileSync('certs/certificate.pem') ],
  checkServerIdentity: () => undefined,
});