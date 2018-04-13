// Typescript example

import * as tls from 'tls';
import { ISocketCallbacks, Socket } from '../src/socket';

const tlsCallback: ISocketCallbacks = {
  onClose: (e: any) => {
    console.log('onClose', e);
  },
  onTimeout: (e: Error) => {
    console.log('onTimeout', e);
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
  onSocketConnection: async (socket: tls.TLSSocket) => {
    Socket.request(socket, 'blockchain.address.get_balance', ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa']);
  },
};

Socket.tlsSocket('185.64.116.15', 50002, tlsCallback);
