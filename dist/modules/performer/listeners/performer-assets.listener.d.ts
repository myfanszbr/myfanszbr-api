import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { MailerService } from 'src/modules/mailer';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserService } from 'src/modules/user/services';
import { PerformerModel } from '../models';
export declare class PerformerAssetsListener {
    private readonly userService;
    private readonly subscriptionService;
    private readonly followService;
    private readonly performerModel;
    private readonly mailerService;
    private readonly queueEventService;
    constructor(userService: UserService, subscriptionService: SubscriptionService, followService: FollowService, performerModel: Model<PerformerModel>, mailerService: MailerService, queueEventService: QueueEventService);
    handlePhotoCount(event: QueueEvent): Promise<void>;
    handleVideoCount(event: QueueEvent): Promise<void>;
    handleProductCount(event: QueueEvent): Promise<void>;
    handleFeedCount(event: QueueEvent): Promise<void>;
    private handleDeleteMailer;
    private handleNewMailer;
}
