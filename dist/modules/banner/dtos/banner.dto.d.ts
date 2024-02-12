import { Types } from 'mongoose';
export declare class BannerDto {
    _id?: Types.ObjectId;
    fileId?: Types.ObjectId;
    title?: string;
    description?: string;
    link?: string;
    status?: string;
    position?: string;
    processing?: boolean;
    photo?: any;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<BannerDto>);
}
