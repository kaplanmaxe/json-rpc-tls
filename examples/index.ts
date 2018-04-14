// Typescript example

import * as tls from 'tls';
import * as fs from 'fs';
import { ISocketCallbacks, Socket } from '../src/socket';

const tlsCallback: ISocketCallbacks = {
  onClose: (e: any) => {
    console.log('onClose', e);
  },
  onTimeout: (socket: tls.TLSSocket, e: Error) => {
    console.log('onTimeout', e);
    // Close socket if you want
    Socket.close(socket);
  },
  onData: (chunk: any) => {
    console.log('onData', JSON.parse(chunk));
  },
  onEnd: (e: any) => {
    console.log('onEnd', e);
  },
  onError: (e: Error) => {
    console.log('onError', e);
  },
  onSocketConnection: (socket: tls.TLSSocket) => {
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
    Socket.request(socket, 1, 'blockchain.address.get_balance', ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']);
  },
};

Socket.tlsSocket('185.64.116.15', 50002, tlsCallback, {
  ca: [ fs.readFileSync('certs/certificate.pem') ],
  checkServerIdentity: () => undefined, // Self signed cert
});
