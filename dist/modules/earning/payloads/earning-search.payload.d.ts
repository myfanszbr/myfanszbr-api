import { SearchRequest } from 'src/kernel/common';
import { Types } from 'mongoose';
export declare class EarningSearchRequestPayload extends SearchRequest {
    performerId?: string | Types.ObjectId;
    transactionId?: string | Types.ObjectId;
    sourceType?: string;
    type?: string;
    fromDate?: string | Date;
    toDate?: string | Date;
    paidAt?: string | Date;
    isPaid?: boolean;
    isToken?: any;
}
export declare class UpdateEarningStatusPayload {
    performerId: string;
    fromDate: string | Date;
    toDate: string | Date;
}
