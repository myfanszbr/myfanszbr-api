import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CustomerCardService } from '../services';
export declare class PaymentCardController {
    private readonly customerCardService;
    constructor(customerCardService: CustomerCardService);
    getCards(req: any, user: UserDto): Promise<DataResponse<any>>;
    deleteCard(user: UserDto, cardId: string): Promise<DataResponse<any>>;
}
