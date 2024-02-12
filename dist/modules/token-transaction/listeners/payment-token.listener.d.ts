import { QueueEvent, QueueEventService } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
export declare class PaymentTokenListener {
    private readonly performerService;
    private readonly userService;
    private readonly mailService;
    private readonly queueEventService;
    constructor(performerService: PerformerService, userService: UserService, mailService: MailerService, queueEventService: QueueEventService);
    handleMailerTransaction(event: QueueEvent): Promise<void>;
}
