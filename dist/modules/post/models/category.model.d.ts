import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class CategoryModel extends Document {
    type: string;
    title: string;
    slug: string;
    parentId: string | Types.ObjectId;
    description: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
