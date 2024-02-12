import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { SubscriptionModel } from '../models/subscription.model';
import { SubscriptionDto } from '../dtos/subscription.dto';
export declare class TransactionSubscriptionListener {
    private readonly performerService;
    private readonly userService;
    private readonly subscriptionModel;
    private readonly queueEventService;
    constructor(performerService: PerformerService, userService: UserService, subscriptionModel: Model<SubscriptionModel>, queueEventService: QueueEventService);
    handleListenSubscription(event: QueueEvent): Promise<SubscriptionDto>;
}
