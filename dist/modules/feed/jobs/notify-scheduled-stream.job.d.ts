import { Model } from 'mongoose';
import { AgendaService } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { ScheduledStreamNotificationModel } from '../models';
export declare class ScheduledStreamNofificationAgendaJob {
    private readonly subscriptionService;
    private readonly followService;
    private readonly performerService;
    private readonly userService;
    private readonly scheduledStreamNotificationModel;
    private readonly mailerService;
    private readonly agenda;
    constructor(subscriptionService: SubscriptionService, followService: FollowService, performerService: PerformerService, userService: UserService, scheduledStreamNotificationModel: Model<ScheduledStreamNotificationModel>, mailerService: MailerService, agenda: AgendaService);
    private defineJobs;
    private handleMailer;
}
