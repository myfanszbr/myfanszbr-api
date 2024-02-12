import { DataResponse, PageableData } from 'src/kernel';
import { PaymentSearchService } from '../services';
import { PaymentSearchPayload } from '../payloads/payment-search.payload';
import { IPaymentResponse } from '../dtos';
export declare class AdminPaymentTransactionController {
    private readonly paymentService;
    constructor(paymentService: PaymentSearchService);
    adminTranasctions(req: PaymentSearchPayload): Promise<DataResponse<PageableData<IPaymentResponse>>>;
}
