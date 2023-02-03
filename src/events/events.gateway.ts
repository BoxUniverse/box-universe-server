import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    // console.log(client, payload);

    this.server.emit('cc', 'hello');
  }
}
