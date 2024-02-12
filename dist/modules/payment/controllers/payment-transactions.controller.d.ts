import { DataResponse, PageableData } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PaymentSearchService } from '../services';
import { PaymentSearchPayload } from '../payloads/payment-search.payload';
import { IPaymentResponse } from '../dtos';
export declare class PaymentTransactionController {
    private readonly paymentService;
    constructor(paymentService: PaymentSearchService);
    userTranasctions(req: PaymentSearchPayload, user: PerformerDto): Promise<DataResponse<PageableData<IPaymentResponse>>>;
}
