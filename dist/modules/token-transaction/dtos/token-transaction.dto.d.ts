import { Types } from 'mongoose';
export interface PaymentProduct {
    name: string;
    description: string;
    price: number;
    extraInfo: any;
    productType: string;
    productId: Types.ObjectId;
    performerId: Types.ObjectId;
    quantity: number;
    tokens: number;
}
export interface DigitalProductResponse {
    digitalFileUrl: any;
    digitalFileId: any;
    _id: Types.ObjectId;
}
export declare class TokenTransactionDto {
    _id: Types.ObjectId;
    sourceInfo?: any;
    source: string;
    sourceId: Types.ObjectId;
    performerId: Types.ObjectId;
    performerInfo?: any;
    target: string;
    targetId: Types.ObjectId;
    sessionId: string;
    type: string;
    products: PaymentProduct[];
    totalPrice: number;
    originalPrice: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    digitalProducts: DigitalProductResponse[];
    shippingInfo: any;
    constructor(data: any);
    toResponse(includePrivateInfo?: boolean): any;
}
