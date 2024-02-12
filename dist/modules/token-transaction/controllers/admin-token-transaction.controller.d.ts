import { DataResponse, PageableData } from 'src/kernel';
import { TokenTransactionSearchService } from '../services';
import { PaymentTokenSearchPayload } from '../payloads/purchase-item.search.payload';
import { TokenTransactionDto } from '../dtos';
export declare class AdminPaymentTokenController {
    private readonly tokenTransactionSearchService;
    constructor(tokenTransactionSearchService: TokenTransactionSearchService);
    adminTranasctions(req: PaymentTokenSearchPayload): Promise<DataResponse<PageableData<TokenTransactionDto>>>;
}
