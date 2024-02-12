import { Types } from 'mongoose';
export declare class PayoutRequestDto {
    _id: any;
    source: string;
    sourceId: Types.ObjectId;
    sourceInfo: any;
    paymentAccountInfo?: any;
    paymentAccountType: string;
    requestNote: string;
    adminNote?: string;
    status: string;
    requestTokens: number;
    tokenConversionRate: number;
    payoutId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PayoutRequestDto>);
}
