import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PostMetaModel extends Document {
    postId?: Types.ObjectId;
    key: any;
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
}
