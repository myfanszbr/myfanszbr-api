import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentService } from '../services/payment.service';
export declare class CancelSubscriptionController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    ccbillCancel(subscriptionId: string, user: UserDto): Promise<DataResponse<any>>;
    stripeCancel(subscriptionId: string, user: UserDto): Promise<DataResponse<any>>;
    systemCancel(subscriptionId: string, user: UserDto): Promise<DataResponse<any>>;
}
