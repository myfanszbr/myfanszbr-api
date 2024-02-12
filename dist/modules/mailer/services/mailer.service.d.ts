/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { QueueService } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { Model } from 'mongoose';
import { IMail } from '../interfaces';
import { EmailTemplateUpdatePayload } from '../payloads/email-template-update.payload';
import { EmailTemplateModel } from '../models/email-template.model';
export declare class MailerService {
    private readonly queueService;
    private readonly settingService;
    private readonly EmailTemplate;
    private mailerQueue;
    constructor(queueService: QueueService, settingService: SettingService, EmailTemplate: Model<EmailTemplateModel>);
    private init;
    private getTransport;
    private getTemplate;
    private process;
    send(email: IMail): Promise<void>;
    verify(): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo | {
        hasError: boolean;
        error: any;
    }>;
    getAllTemplates(): Promise<(import("mongoose").Document<unknown, {}, EmailTemplateModel> & Omit<EmailTemplateModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, EmailTemplateModel> & Omit<EmailTemplateModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    updateTemplate(id: string, payload: EmailTemplateUpdatePayload): Promise<import("mongoose").Document<unknown, {}, EmailTemplateModel> & Omit<EmailTemplateModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
}
