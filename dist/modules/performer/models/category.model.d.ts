import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class CategoryModel extends Document {
    name: string;
    slug: string;
    ordering: number;
    description: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
