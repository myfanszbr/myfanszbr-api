import { Types } from 'mongoose';
import { ICouponResponse } from 'src/modules/coupon/dtos';
export interface PaymentProduct {
    name?: string;
    description?: string;
    price?: number;
    extraInfo?: any;
    productType?: string;
    productId?: Types.ObjectId;
    performerId?: Types.ObjectId;
    quantity?: number;
}
export declare class IPaymentResponse {
    _id: Types.ObjectId;
    paymentGateway?: string;
    sourceInfo?: any;
    source?: string;
    sourceId: Types.ObjectId;
    performerId?: Types.ObjectId;
    performerInfo?: any;
    target?: string;
    targetId?: Types.ObjectId;
    type?: string;
    products?: PaymentProduct[];
    paymentResponseInfo?: any;
    invoiceId?: string;
    stripeClientSecret?: string;
    totalPrice?: number;
    originalPrice?: number;
    couponInfo?: ICouponResponse;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaymentDto {
    _id: Types.ObjectId;
    paymentGateway?: string;
    sourceInfo?: any;
    source?: string;
    sourceId: Types.ObjectId;
    performerId?: Types.ObjectId;
    performerInfo?: any;
    target?: string;
    targetId?: Types.ObjectId;
    type?: string;
    products?: PaymentProduct[];
    paymentResponseInfo?: any;
    invoiceId?: string;
    stripeClientSecret?: string;
    totalPrice?: number;
    originalPrice?: number;
    couponInfo?: ICouponResponse;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PaymentDto>);
    toResponse(includePrivateInfo?: boolean): IPaymentResponse;
}
