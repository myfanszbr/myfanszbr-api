import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PostModel extends Document {
    authorId: Types.ObjectId;
    type: string;
    title: string;
    slug: string;
    ordering: number;
    content: string;
    shortDescription: string;
    categoryIds: string[];
    categorySearchIds?: string[];
    status: string;
    image?: string;
    updatedBy?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
