import { Document } from 'mongoose';
export declare class SettingModel extends Document {
    key: string;
    value: any;
    name: string;
    description: string;
    group: string;
    public: boolean;
    type: string;
    visible: boolean;
    editable: boolean;
    meta: any;
    autoload: boolean;
    ordering: number;
    createdAt?: Date;
    updatedAt?: Date;
    extra?: string;
}
