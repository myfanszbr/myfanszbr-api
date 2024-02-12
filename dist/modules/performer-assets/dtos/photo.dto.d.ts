import { Types } from 'mongoose';
export declare class PhotoDto {
    _id?: Types.ObjectId;
    performerId?: Types.ObjectId;
    galleryId?: Types.ObjectId;
    fileId?: Types.ObjectId;
    photo?: any;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    price?: number;
    performer?: any;
    gallery?: any;
    isGalleryCover?: boolean;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<PhotoDto>);
}
