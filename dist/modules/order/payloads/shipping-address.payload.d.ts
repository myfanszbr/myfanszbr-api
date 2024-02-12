import { SearchRequest } from 'src/kernel/common';
export declare class AddressBodyPayload extends SearchRequest {
    name: string;
    country: string;
    state: string;
    city: string;
    district: string;
    ward: string;
    streetAddress: string;
    streetNumber: string;
    zipCode: string;
    note: string;
}
