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
import { PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { FollowModel } from '../models/follow.model';
import { FollowSearchRequestPayload } from '../payloads';
import { FollowDto } from '../dtos/follow.dto';
import { PerformerService } from '../../performer/services';
export declare class FollowService {
    private readonly performerService;
    private readonly userService;
    private readonly followModel;
    private readonly mailerService;
    constructor(performerService: PerformerService, userService: UserService, followModel: Model<FollowModel>, mailerService: MailerService);
    countOne(query: any): Promise<number>;
    findOne(query: any): Promise<import("mongoose").Document<unknown, {}, FollowModel> & Omit<FollowModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, FollowModel> & Omit<FollowModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    create(followingId: string, user: UserDto): Promise<FollowDto>;
    remove(followingId: string, user: UserDto): Promise<boolean>;
    search(req: FollowSearchRequestPayload): Promise<PageableData<FollowDto>>;
}
