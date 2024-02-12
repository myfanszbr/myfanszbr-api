import { SearchRequest } from 'src/kernel/common';
import { Types } from 'mongoose';
export declare class PayoutRequestCreatePayload {
    source: string;
    requestTokens: number;
    requestNote: string;
    paymentAccountType?: string;
}
export declare class PayoutRequestPerformerUpdatePayload {
    requestNote: string;
    requestTokens: number;
    paymentAccountType?: string;
}
export declare class PayoutRequestUpdatePayload {
    status: string;
    adminNote: string;
}
export declare class PayoutRequestSearchPayload extends SearchRequest {
    sourceId: string | Types.ObjectId;
    paymentAccountType?: string;
    fromDate: Date;
    toDate: Date;
    status: string;
    source: string;
}
