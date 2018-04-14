// Typescript example

import * as tls from 'tls';
import * as fs from 'fs';
import { Socket } from '../src/socket';

Socket.tlsSocket('185.64.116.15', 50002, {
  ca: [ fs.readFileSync('certs/certificate.pem') ],
  checkServerIdentity: () => undefined, // Self signed cert
}).then(async (socket: tls.TLSSocket) => {
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
  console.log(JSON.parse(balance as string));
})
.catch((error) => {
  console.log(error.error);
  Socket.close(error.socket);
});
