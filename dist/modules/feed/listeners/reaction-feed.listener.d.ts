import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { FeedModel } from '../models/feed.model';
export declare class ReactionFeedListener {
    private readonly userService;
    private readonly performerService;
    private readonly queueEventService;
    private readonly feedModel;
    private readonly mailerService;
    constructor(userService: UserService, performerService: PerformerService, queueEventService: QueueEventService, feedModel: Model<FeedModel>, mailerService: MailerService);
    handleReactFeed(event: QueueEvent): Promise<void>;
}
