import { DataResponse } from 'src/kernel';
import { WebhooksPaymentService } from '../services/webhooks.service';
export declare class PaymentWebhookController {
    private readonly webhooksPaymentService;
    constructor(webhooksPaymentService: WebhooksPaymentService);
    ccbillCallhook(payload: Record<string, string>, req: Record<string, string>, ipAddress: string): Promise<DataResponse<any>>;
    stripePaymentCallhook(payload: Record<string, string>): Promise<DataResponse<any>>;
}
