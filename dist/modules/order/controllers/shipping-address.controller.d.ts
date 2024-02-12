import { DataResponse, PageableData, SearchRequest } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { ShippingAddressService } from '../services';
import { ShippingAddressModel } from '../models';
import { AddressBodyPayload } from '../payloads';
export declare class ShippingAddressController {
    private readonly shippingAddressService;
    constructor(shippingAddressService: ShippingAddressService);
    orders(req: SearchRequest, user: UserDto): Promise<DataResponse<PageableData<any>>>;
    create(user: UserDto, payload: AddressBodyPayload): Promise<DataResponse<ShippingAddressModel>>;
    findOne(id: string, payload: AddressBodyPayload, user: UserDto): Promise<DataResponse<boolean>>;
    update(id: string, user: UserDto): Promise<DataResponse<ShippingAddressModel>>;
    delete(id: string, user: UserDto): Promise<DataResponse<boolean>>;
}
