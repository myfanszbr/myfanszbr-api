import { Types } from 'mongoose';
export interface ICouponResponse {
    _id?: Types.ObjectId;
    name?: string;
    description?: string;
    code?: string;
    value?: number;
    numberOfUses?: number;
    expiredDate?: string | Date;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class CouponDto {
    _id?: Types.ObjectId;
    name?: string;
    description?: string;
    code?: string;
    value?: number;
    numberOfUses?: number;
    expiredDate?: string | Date;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<CouponDto>);
    toResponse(includePrivateInfo?: boolean): {
        _id: Types.ObjectId;
        code: string;
        value: number;
    };
}
