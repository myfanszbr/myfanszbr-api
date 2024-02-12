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
import { Model } from 'mongoose';
import { QueueEventService } from 'src/kernel';
import { PerformerModel } from 'src/modules/performer/models';
import { SettingModel } from '../models';
import { SettingCreatePayload, SettingUpdatePayload } from '../payloads';
import { SettingDto } from '../dtos';
import { MenuService } from './menu.service';
export declare class SettingService {
    private readonly settingModel;
    private readonly performerModel;
    private readonly queueEventService;
    private readonly menuService;
    static _settingCache: Map<string, any>;
    static _publicSettingsCache: any;
    constructor(settingModel: Model<SettingModel>, performerModel: Model<PerformerModel>, queueEventService: QueueEventService, menuService: MenuService);
    private publishChange;
    private subscribeChange;
    syncCache(): Promise<void>;
    get(key: string): Promise<SettingDto>;
    getKeyValue(key: string): Promise<any>;
    create(data: SettingCreatePayload): Promise<SettingModel>;
    update(key: string, data: SettingUpdatePayload): Promise<SettingDto>;
    getPublicSettings(): Promise<Record<string, any>>;
    getAutoloadPublicSettingsForUser(): Promise<Record<string, any>>;
    getPublicValueByKey(key: string): {
        value: any;
    };
    getPublicValueByKeys(keys: string[]): any;
    getCommissionSettings(): Promise<(import("mongoose").Document<unknown, {}, SettingModel> & Omit<SettingModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    getPublicMenus(): Promise<{
        title: string;
        path: string;
        internal: boolean;
        help: string;
        section: string;
        ordering: number;
        isNewTab: boolean;
    }[]>;
    getEditableSettings(group?: string): Promise<SettingDto[]>;
    static getByKey(key: string): any;
    static getValueByKey(key: string): any;
}
