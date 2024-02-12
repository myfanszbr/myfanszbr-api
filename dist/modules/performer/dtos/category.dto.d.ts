import { Types } from 'mongoose';
export declare class PerformerCategoryDto {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    ordering: number;
    description: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PerformerCategoryDto>);
}
