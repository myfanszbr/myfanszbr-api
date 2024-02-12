import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
export declare class TransactionMailerListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly performerService;
    private readonly userService;
    constructor(queueEventService: QueueEventService, mailService: MailerService, performerService: PerformerService, userService: UserService);
    handleMailerTransaction(event: QueueEvent): Promise<void>;
}
