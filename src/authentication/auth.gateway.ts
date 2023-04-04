import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { toNumber } from 'lodash';
@WebSocketGateway()
@Injectable()
export class AuthGateway {
  @WebSocketServer() server;
  //sss
  //as
}
