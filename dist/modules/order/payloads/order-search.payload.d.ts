import { SearchRequest } from 'src/kernel/common';
export declare class OrderSearchPayload extends SearchRequest {
    userId: string;
    performerId: string;
    deliveryStatus: string;
    deliveryAddressId: string;
    phoneNumber: string;
    fromDate: Date;
    toDate: Date;
}
export declare class OrderUpdatePayload extends SearchRequest {
    deliveryStatus: string;
    shippingCode: string;
    deliveryAddressId: string;
}
