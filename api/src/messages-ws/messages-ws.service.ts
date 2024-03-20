import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  private connedtedClients: ConnectedClients = {};

  registerClient(client: Socket) {
    this.connedtedClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connedtedClients[clientId];
  }

  getConnectedClients(): number {
    // get the number of connected clients
    return Object.keys(this.connedtedClients).length;
  }
}
