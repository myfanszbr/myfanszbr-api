import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ConversationModel } from '../models';
export declare class NewSubscriptionListener {
    private readonly queueEventService;
    private readonly conversationModel;
    constructor(queueEventService: QueueEventService, conversationModel: Model<ConversationModel>);
    private handleData;
}
