import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';

@WebSocketGateway(3005, { cors: true })
@Injectable()
export class AuthGateway {
  @WebSocketServer() server;

  @SubscribeMessage('login')
  handleMessage(client: any, payload: any): void {
    console.log('Client: ', client.id, ' Payload: ', payload);
    console.log(client.request);

    // this.server.emit(, 'hello');
  }
}
