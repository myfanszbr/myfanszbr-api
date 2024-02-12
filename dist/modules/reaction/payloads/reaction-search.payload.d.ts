import { SearchRequest } from 'src/kernel/common';
import { Types } from 'mongoose';
export declare class ReactionSearchRequestPayload extends SearchRequest {
    objectId?: string | Types.ObjectId;
    action?: string;
    objectType?: string;
    createdBy?: string | Types.ObjectId;
}
