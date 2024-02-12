import { Types } from 'mongoose';
export declare class AuthCreateDto {
    source: string;
    sourceId: Types.ObjectId;
    type?: string;
    key?: string;
    value?: string;
    constructor(data: Partial<AuthCreateDto>);
}
