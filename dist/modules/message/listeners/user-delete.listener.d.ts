import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { FileService } from 'src/modules/file/services';
import { ConversationModel, MessageModel, NotificationMessageModel } from '../models';
export declare class DeleteUserMessageListener {
    private readonly fileService;
    private readonly queueEventService;
    private readonly messageModel;
    private readonly conversationModel;
    private readonly notificationMessageModel;
    constructor(fileService: FileService, queueEventService: QueueEventService, messageModel: Model<MessageModel>, conversationModel: Model<ConversationModel>, notificationMessageModel: Model<NotificationMessageModel>);
    private handleDeleteData;
}
