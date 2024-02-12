import * as mongoose from 'mongoose';
export declare const siteBlockCountrySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    countryCode?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    countryCode?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: Date;
    countryCode?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
export declare const BlockCountrySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    countryCode?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    countryCode?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: Date;
    countryCode?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
