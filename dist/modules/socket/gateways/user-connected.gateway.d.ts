import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services';
import { QueueEventService } from 'src/kernel';
import { SocketUserService } from '../services/socket-user.service';
export declare class WsUserConnectedGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly authService;
    constructor(queueEventService: QueueEventService, socketUserService: SocketUserService, authService: AuthService);
    handleConnection(client: any): Promise<void>;
    handleDisconnect(client: any): Promise<void>;
    handleLogin(client: Socket, payload: {
        token: string;
    }): Promise<void>;
    handleLogout(client: Socket, payload: {
        token: string;
    }): Promise<void>;
    login(client: any, token: string): Promise<void>;
    logout(client: any, token: string): Promise<void>;
}
