import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { SearchRequest, PageableData } from 'src/kernel';
import { ShippingAddressModel } from '../models';
import { AddressBodyPayload } from '../payloads';
export declare class ShippingAddressService {
    private readonly addressModel;
    constructor(addressModel: Model<ShippingAddressModel>);
    findOne(id: string, user: UserDto): Promise<ShippingAddressModel>;
    create(payload: AddressBodyPayload, user: UserDto): Promise<ShippingAddressModel>;
    update(id: string, payload: AddressBodyPayload, user: UserDto): Promise<any>;
    delete(id: string, user: UserDto): Promise<any>;
    search(req: SearchRequest, user: UserDto): Promise<PageableData<any>>;
}
