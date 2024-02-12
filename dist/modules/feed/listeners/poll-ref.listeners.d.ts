import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { PollModel } from '../models';
import { FeedService } from '../services';
export declare class PollFeedListener {
    private readonly feedService;
    private readonly performerService;
    private readonly userService;
    private readonly queueEventService;
    private readonly mailerService;
    private readonly pollModel;
    constructor(feedService: FeedService, performerService: PerformerService, userService: UserService, queueEventService: QueueEventService, mailerService: MailerService, pollModel: Model<PollModel>);
    handleRefPoll(event: QueueEvent): Promise<void>;
    handleVotePoll(event: QueueEvent): Promise<void>;
}
