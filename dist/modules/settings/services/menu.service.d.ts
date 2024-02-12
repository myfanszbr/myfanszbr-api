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
import { Types } from 'mongoose';
import { PageableData } from 'src/kernel';
import { MenuModel } from '../models';
import { MenuDto } from '../dtos';
import { MenuCreatePayload, MenuSearchRequestPayload, MenuUpdatePayload } from '../payloads';
export declare class MenuService {
    private readonly menuModel;
    constructor(menuModel: Model<MenuModel>);
    checkOrdering(ordering: number, id?: string | Types.ObjectId): any;
    findById(id: string | Types.ObjectId): Promise<MenuModel>;
    create(payload: MenuCreatePayload): Promise<MenuDto>;
    update(id: string | Types.ObjectId, payload: MenuUpdatePayload): Promise<any>;
    delete(id: string | Types.ObjectId | MenuModel): Promise<boolean>;
    search(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
    userSearch(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
    getPublicMenus(): Promise<(import("mongoose").Document<unknown, {}, MenuModel> & Omit<MenuModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
}
