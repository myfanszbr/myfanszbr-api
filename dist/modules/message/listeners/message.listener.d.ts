import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { StreamService } from 'src/modules/stream/services';
import { FileService } from 'src/modules/file/services';
import { ConversationModel, NotificationMessageModel, MessageModel } from '../models';
export declare class MessageListener {
    private readonly streamService;
    private readonly fileService;
    private readonly conversationModel;
    private readonly NotificationModel;
    private readonly messageModel;
    private readonly queueEventService;
    private readonly socketUserService;
    constructor(streamService: StreamService, fileService: FileService, conversationModel: Model<ConversationModel>, NotificationModel: Model<NotificationMessageModel>, messageModel: Model<MessageModel>, queueEventService: QueueEventService, socketUserService: SocketUserService);
    private handleMessage;
    private updateLastMessage;
    handleDeleteMessage(event: QueueEvent): Promise<void>;
    private updateNotification;
    private notifyCountingNotReadMessageInConversation;
    private handleSent;
    private handleDelete;
    private handleStreamMessage;
}
