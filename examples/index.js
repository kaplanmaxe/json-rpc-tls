const fs = require('fs');
const Socket = require('../dist/socket').Socket;

const tlsCallback = {
  onClose: (e) => {
    console.log('onClose', e);
  },
  onTimeout: (socket, e) => {
    console.log('onTimeout', e);
    Socket.close(socket);
  },
  onEnd: (e) => {
    console.log('onEnd', e);
  },
  onError: (e) => {
    console.log('onError', e);
  },
  onSocketConnection: async (socket) => {
    // Set options
    socket.setEncoding('utf8');
    socket.setKeepAlive(true, 0);
    socket.setNoDelay(true);
    socket.setTimeout(5000);

    // Get peer certificate
    const cert = Socket.getPeerCertificate(socket).raw;

    // Convert DER cert to PEM cert if needed
    console.log(Socket.derCertToPemCert(cert));

    // Make requests
    const balance = await Socket.request(
      socket,
      1,
      'blockchain.address.get_balance',
      ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
    );
    console.log(JSON.parse(balance));
  },
};

Socket.tlsSocket('185.64.116.15', 50002, tlsCallback, {
  ca: [ fs.readFileSync('certs/certificate.pem') ],
  checkServerIdentity: () => undefined,
});