import { Types } from "mongoose";
export declare class UserDto {
    _id: Types.ObjectId;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: string[];
    avatarId: Types.ObjectId;
    stats: {
        totalSubscriptions: number;
        following: number;
    };
    pay2m: {
        customerId: number;
    };
    avatarPath: string;
    status: string;
    username: string;
    gender: string;
    balance: number;
    country: string;
    verifiedEmail: boolean;
    isOnline: boolean;
    twitterConnected: boolean;
    googleConnected: boolean;
    isPerformer?: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<any>);
    getName(): string;
    toResponse(includePrivateInfo?: boolean, isAdmin?: boolean): any;
}
