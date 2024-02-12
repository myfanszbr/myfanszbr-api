import { DataResponse, PageableData } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentTokenSearchPayload, PurchaseProductsPayload, SendTipsPayload } from '../payloads';
import { TokenTransactionSearchService, TokenTransactionService } from '../services';
import { TokenTransactionDto } from '../dtos';
export declare class PaymentTokenController {
    private readonly tokenTransactionService;
    private readonly tokenTransactionSearchService;
    constructor(tokenTransactionService: TokenTransactionService, tokenTransactionSearchService: TokenTransactionSearchService);
    purchaseProduct(user: PerformerDto, productId: string, payload: PurchaseProductsPayload): Promise<DataResponse<any>>;
    purchaseVideo(user: PerformerDto, videoId: string): Promise<DataResponse<any>>;
    buyPhoto(user: PerformerDto, galleryId: string): Promise<DataResponse<any>>;
    purchasePostFeed(user: PerformerDto, id: string): Promise<DataResponse<any>>;
    tip(user: UserDto, performerId: string, payload: SendTipsPayload): Promise<DataResponse<any>>;
    purchaseStream(user: UserDto, streamId: string): Promise<DataResponse<any>>;
    userTranasctions(req: PaymentTokenSearchPayload, user: PerformerDto): Promise<DataResponse<PageableData<TokenTransactionDto>>>;
}
