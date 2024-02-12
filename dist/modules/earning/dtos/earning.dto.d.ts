import { Types } from 'mongoose';
export declare class EarningDto {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    userInfo?: any;
    transactionId: Types.ObjectId;
    transactionInfo?: any;
    performerId: Types.ObjectId;
    performerInfo?: any;
    sourceType: string;
    type: string;
    grossPrice: number;
    netPrice: number;
    siteCommission: number;
    isPaid?: boolean;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;
    paymentGateway?: string;
    isToken?: boolean;
    constructor(data?: Partial<EarningDto>);
}
export interface IEarningStatResponse {
    totalGrossPrice: number;
    totalNetPrice: number;
    totalSiteCommission: number;
}
