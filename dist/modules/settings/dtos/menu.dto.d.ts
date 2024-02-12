import { Types } from 'mongoose';
export interface IMenuResponse {
    _id?: Types.ObjectId;
    title?: string;
    path?: string;
    internal?: boolean;
    parentId?: string;
    help?: string;
    section?: string;
    public?: boolean;
    isPage?: boolean;
    ordering?: number;
    isNewTab?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class MenuDto {
    _id?: Types.ObjectId;
    title?: string;
    path?: string;
    internal?: boolean;
    parentId?: string;
    help?: string;
    section?: string;
    public?: boolean;
    isPage?: boolean;
    ordering?: number;
    isNewTab?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<MenuDto>);
}
