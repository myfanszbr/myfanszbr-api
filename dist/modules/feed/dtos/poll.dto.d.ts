import { Types } from 'mongoose';
export declare class PollDto {
    _id: Types.ObjectId | string;
    createdBy: Types.ObjectId | string;
    totalVote: number;
    expiredAt: Date;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PollDto>);
}
