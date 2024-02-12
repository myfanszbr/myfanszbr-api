import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PurchaseTokenPayload, SubscribePerformerPayload } from '../payloads';
import { PaymentService } from '../services/payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(user: UserDto, payload: SubscribePerformerPayload): Promise<DataResponse<any>>;
    purchaseTokens(user: UserDto, payload: PurchaseTokenPayload): Promise<DataResponse<any>>;
}
