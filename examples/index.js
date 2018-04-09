// Javascript example

const Socket = require('../dist/socket').Socket;

const callbacks = {
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
};

const socket = new Socket('185.64.116.15', 50002, 'tls', callbacks);
socket.connect()
.then(async () => {
  socket.request('blockchain.address.get_balance', ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']);
});