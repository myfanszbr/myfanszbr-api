import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PerformerBlockCountryModel extends Document {
    source: string;
    sourceId: Types.ObjectId | string;
    countryCodes: string[];
    createdAt: Date;
    updatedAt: Date;
}
