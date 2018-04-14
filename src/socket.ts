import * as tls from 'tls';

export interface ISocketCallbacks {
  onClose?: (data: any) => void;
  onTimeout?: (socket: tls.TLSSocket, e: Error) => void;
  onData?: (chunk: any) => void;
  onEnd?: (e: any) => void;
  onError?: (e: Error) => void;
  onSocketConnection?: (socket: tls.TLSSocket) => void;
}

class Socket {

  static tlsSocket(
    host: string,
    port: number,
    callbacks: ISocketCallbacks,
    options?: tls.ConnectionOptions,
  ) {
    try {
      const socket: tls.TLSSocket = tls.connect(port, host, options, () => {

        socket.on('close', (data) => {
          callbacks.onClose(data);
        });

        socket.on('timeout', (error) => {
          callbacks.onTimeout(socket, new Error(error));
        });

        socket.on('data', (chunk) => {
          callbacks.onData(chunk);
        });

        socket.on('end', (e) => {
          callbacks.onEnd(e);
        });

        socket.on('error', (e) => {
          callbacks.onError(new Error(e));
        });

        callbacks.onSocketConnection(socket);
      });
    } catch {
      return new Error('Error establishing tls socket');
    }
  }

  static request(socket: tls.TLSSocket, id: number, method: string, params: string[] = []) {
    const body = JSON.stringify({
        jsonrpc : '2.0',
        id,
        method,
        params,
    });
    socket.write(body + '\n');
  }

  static close(socket: tls.TLSSocket) {
    socket.end();
    socket.destroy();
  }

  static getPeerCertificate(socket: tls.TLSSocket, full: boolean = true) {
    const cert = socket.getPeerCertificate(full);
    return cert;
  }

  static derCertToPemCert(cert: Buffer) {
    const chars = Buffer.from(cert).toString('base64').split('');
    let formattedCert = '-----BEGIN CERTIFICATE-----';
    for (let i = 0; i < chars.length; i++) {
      if (i % 64 === 0) {
        formattedCert += '\n';
      }
      formattedCert += chars[i];
    }
    formattedCert += '\n-----END CERTIFICATE-----';
    return formattedCert;
  }
}

export { Socket };

// const tlsCallback: ISocketCallbacks = {
//   onClose: (e: any) => {
//     console.log('onClose', e);
//   },
//   onTimeout: (socket: tls.TLSSocket, e: Error) => {
//     console.log('onTimeout', e);
//   },
//   onData: (chunk: any) => {
//     console.log('onData', JSON.parse(chunk));
//   },
//   onEnd: (e: any) => {
//     console.log('onEnd', e);
//   },
//   onError: (e: Error) => {
//     console.log('onError', e);
//   },
//   onSocketConnection: (socket: tls.TLSSocket) => {
//     // Set options
//     socket.setEncoding('utf8');
//     socket.setKeepAlive(true, 0);
//     socket.setNoDelay(true);

//     // Get peer certificate
//     const cert = Socket.getPeerCertificate(socket).raw;

//     // Convert DER cert to PEM cert if needed
//     console.log(Socket.derCertToPemCert(cert));

//     // Make requests
//     Socket.request(socket, 1, 'blockchain.address.get_balance', ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']);
//     Socket.request(socket, 2, 'blockchain.address.get_balance', ['1MaxKapqcv8KVHw1mTzZd23uvntnLABvnB']);
//   },
// };

// Socket.tlsSocket('185.64.116.15', 50002, tlsCallback, {
//   ca: [ fs.readFileSync('certs/certificate.pem') ],
//   checkServerIdentity: () => undefined,
// });
