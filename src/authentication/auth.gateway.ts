import {Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';

@WebSocketGateway(3005, {cors: true})
@Injectable()
export class AuthGateway {
	@WebSocketServer() server;
	
}
