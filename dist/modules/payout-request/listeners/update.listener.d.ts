import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
export declare class UpdatePayoutRequestListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly performerService;
    constructor(queueEventService: QueueEventService, mailService: MailerService, performerService: PerformerService);
    handler(event: QueueEvent): Promise<void>;
    private handlePerformer;
}
