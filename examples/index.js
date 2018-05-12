const Socket = require('../dist/socket').Socket;

Socket.tlsSocket('electrum.villocq.com', 50002, {
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined, // Self signed cert
}).then(async (socket) => {
  // Set options
  socket.setEncoding('utf8');
  socket.setKeepAlive(true, 0);
  socket.setNoDelay(true);

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
})
.catch((error) => {
  console.log(error.error);
  Socket.close(error.socket);
});