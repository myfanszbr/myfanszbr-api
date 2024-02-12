import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { StreamModel } from '../models';
export declare class StreamConnectListener {
    private readonly userService;
    private readonly performerService;
    private readonly streamModel;
    private readonly queueEventService;
    private readonly socketUserService;
    constructor(userService: UserService, performerService: PerformerService, streamModel: Model<StreamModel>, queueEventService: QueueEventService, socketUserService: SocketUserService);
    userDisconnectHandler(event: QueueEvent): Promise<void>;
    modelDisconnectHandler(event: QueueEvent): Promise<void>;
    deserializeConversationId(str: string): string;
}
