import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id);
    this.messagesWsService.registerClient(client);
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
    this.messagesWsService.removeClient(client.id);
    // throw new Error('Method not implemented.');
  }
}
