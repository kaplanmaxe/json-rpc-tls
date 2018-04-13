import * as tls from 'tls';
import * as fs from 'fs';
import { exec } from 'child_process';

export interface ISocketCallbacks {
  onClose: (data: any) => void;
  onTimeout: (e: Error) => void;
  onData: (chunk: any) => void;
  onEnd: (e: any) => void;
  onError: (e: Error) => void;
  onSocketConnection: (socket: tls.TLSSocket) => void;
}

const TIMEOUT = 10000;

class Socket {

  static tlsSocket(
    host: string,
    port: number,
    callbacks: ISocketCallbacks,
    options?: tls.TlsOptions,
  ) {
    try {
      const socket: tls.TLSSocket = tls.connect(port, host, options, () => {
        socket.setTimeout(TIMEOUT);
        socket.setEncoding('utf8');
        socket.setKeepAlive(true, 0);
        socket.setNoDelay(true);

        socket.on('close', (data) => {
          callbacks.onClose(data);
        });

        socket.on('timeout', (error) => {
          callbacks.onTimeout(new Error(error));
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

  static request(socket: tls.TLSSocket, method: string, params: string[] = []) {
    const body = JSON.stringify({
        jsonrpc : '2.0',
        method,
        params,
        id: 1, // TODO: dynamically set this
    });
    socket.write(body + '\n');
  }

  static close(socket: tls.TLSSocket) {
    socket.end();
    socket.destroy();
  }
}

export { Socket };
