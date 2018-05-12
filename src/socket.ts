import * as tls from 'tls';

export interface ISocketError {
  socket: tls.TLSSocket;
  error: Error;
}

class Socket {
  static tlsSocket(
    host: string,
    port: number,
    options?: tls.ConnectionOptions,
    connectionTimeout: number = 3000,
  ): Promise<tls.TLSSocket | ISocketError> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject({ socket , error: new Error('ECONN') }), connectionTimeout);
      const socket: tls.TLSSocket = tls.connect(port, host, options, () => {
        clearInterval(timeout);
        resolve(socket);
      });
    });
  }

  static request(socket: tls.TLSSocket, id: number, method: string, params: string[] = []) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        jsonrpc : '2.0',
        id,
        method,
        params,
      });
      socket.on('data', (chunk) => {
        resolve(chunk);
        socket.removeAllListeners();
      });
      socket.on('error', (e) => {
        reject(new Error(e));
        socket.removeAllListeners();
      });
      socket.write(body + '\n');
    });
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
