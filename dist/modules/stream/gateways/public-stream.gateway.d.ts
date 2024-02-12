import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services';
import { StreamService } from 'src/modules/stream/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerService } from 'src/modules/performer/services';
import { ConversationService } from 'src/modules/message/services';
import { UserService } from 'src/modules/user/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { MailerService } from 'src/modules/mailer/services';
import { StreamModel } from '../models';
export declare const STREAM_EVENT: {
    JOIN_BROADCASTER: string;
    MODEL_JOINED: string;
    MODEL_LEFT: string;
    ROOM_INFORMATIOM_CHANGED: string;
    LEAVE_ROOM: string;
    JOIN_ROOM: string;
    GO_LIVE: string;
    ADMIN_END_SESSION_STREAM: string;
};
export declare class PublicStreamWsGateway {
    private readonly followService;
    private readonly subscriptionService;
    private readonly userService;
    private readonly performerService;
    private readonly authService;
    private readonly conversationService;
    private readonly socketService;
    private readonly streamModel;
    private readonly streamService;
    private readonly mailService;
    constructor(followService: FollowService, subscriptionService: SubscriptionService, userService: UserService, performerService: PerformerService, authService: AuthService, conversationService: ConversationService, socketService: SocketUserService, streamModel: Model<StreamModel>, streamService: StreamService, mailService: MailerService);
    goLive(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleJoinPublicRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    handleLeavePublicRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
}
