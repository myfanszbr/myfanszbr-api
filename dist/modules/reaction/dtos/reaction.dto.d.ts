import { Types } from 'mongoose';
export declare class ReactionDto {
    _id?: Types.ObjectId;
    source?: string;
    action?: string;
    objectId?: Types.ObjectId;
    objectInfo?: any;
    objectType?: string;
    createdBy?: string | Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    creator?: any;
    constructor(data?: Partial<ReactionDto>);
}
