import { Document, Types } from 'mongoose';
export interface IRefItem {
    itemType: string;
    itemId: Types.ObjectId;
}
export declare class FileModel extends Document {
    type: string;
    name: string;
    description: string;
    mimeType: string;
    server: string;
    path: string;
    absolutePath: string;
    width: number;
    height: number;
    duration: number;
    size: number;
    status: string;
    thumbnails: any;
    encoding: string;
    refItems: IRefItem[];
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    acl: string;
    metadata: any;
    error: any;
}
