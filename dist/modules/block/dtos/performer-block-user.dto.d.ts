import { Types } from 'mongoose';
export declare class PerformerBlockUserDto {
    _id: Types.ObjectId;
    source: string;
    sourceId: Types.ObjectId;
    target: string;
    targetId: Types.ObjectId;
    reason: string;
    targetInfo?: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PerformerBlockUserDto>);
}
