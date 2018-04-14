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
          if (callbacks.onClose) { callbacks.onClose(data); }
        });

        socket.on('timeout', (error) => {
          if (callbacks.onTimeout) { callbacks.onTimeout(socket, error); }
        });

        socket.on('data', (chunk) => {
          if (callbacks.onData) { callbacks.onData(chunk); }
        });

        socket.on('end', (e) => {
          if (callbacks.onEnd) { callbacks.onEnd(e); }
        });

        socket.on('error', (e) => {
          if (callbacks.onError) { callbacks.onError(new Error(e)); }
        });

        callbacks.onSocketConnection(socket);
      });
    } catch {
      return new Error('Error establishing tls socket');
    }
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
      });
      socket.on('error', (e) => {
        reject(new Error(e));
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
