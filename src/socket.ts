import * as tls from 'tls';
import * as net from 'net';

export type Protocol = 'tls' | 'tcp';

export interface ISocketCallbacks {
  onClose: (data: any) => void;
  onTimeout: (e: Error) => void;
  onData: (chunk: any) => void;
  onEnd: (e: any) => void;
  onError: (e: Error) => void;
}

const TIMEOUT = 10000;

class Socket {

  public options: any;
  public socket: tls.TLSSocket;
  public host: string;
  public port: number;
  public protocol: Protocol;

  constructor(host: string, port: number, protocol: Protocol, callbacks: ISocketCallbacks, options?: any) {
    this.options = options;
    this.host = host;
    this.port = port;
    this.protocol = protocol;

    if (this.protocol === 'tls') {
      this.socket = new tls.TLSSocket(options);
    }

    this.socket.setTimeout(TIMEOUT);
    this.socket.setEncoding('utf8');
    this.socket.setKeepAlive(true, 0);
    this.socket.setNoDelay(true);

    this.socket.on('close', (data) => {
      callbacks.onClose(data);
    });

    this.socket.on('timeout', (error) => {
      callbacks.onTimeout(new Error(error));
    });

    this.socket.on('data', (chunk) => {
      callbacks.onData(chunk);
    });

    this.socket.on('end', (e) => {
      callbacks.onEnd(e);
    });

    this.socket.on('error', (e) => {
      callbacks.onError(new Error(e));
    });
  }

  async connect() {
    this.socket.connect(this.port, this.host, () => {
      return true;
    });
  }

  request(method: string, params: [string] = ['']) {
    const body = JSON.stringify({
        jsonrpc : '2.0',
        method,
        params,
        id: 1,
    });
    this.socket.write(body + '\n');
  }

  close() {
    this.socket.end();
    this.socket.destroy();
  }
}

export { Socket };
