import { Types } from 'mongoose';
export declare class SettingDto {
    _id: Types.ObjectId;
    key: string;
    value: any;
    oldValue?: any;
    name: string;
    description: string;
    group: string;
    public: boolean;
    type: string;
    visible: boolean;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    extra: string;
    autoload: boolean;
    ordering: number;
    constructor(data?: Partial<SettingDto>);
    getValue(): any;
}
