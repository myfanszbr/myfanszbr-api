import { Types } from 'mongoose';
export declare class ReportDto {
    _id: Types.ObjectId;
    title: string;
    description: string;
    source: string;
    sourceId: Types.ObjectId;
    sourceInfo?: any;
    performerId: Types.ObjectId;
    performerInfo?: any;
    target: string;
    targetId: Types.ObjectId;
    targetInfo?: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<ReportDto>);
}
