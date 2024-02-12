import { Types } from 'mongoose';
export declare class CommentDto {
    _id: Types.ObjectId;
    objectId?: Types.ObjectId;
    content?: string;
    createdBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    creator?: any;
    object?: any;
    isAuth?: boolean;
    recipientId?: Types.ObjectId;
    objectType?: string;
    isLiked?: boolean;
    totalReply?: number;
    totalLike?: number;
    constructor(data?: Partial<CommentDto>);
}
