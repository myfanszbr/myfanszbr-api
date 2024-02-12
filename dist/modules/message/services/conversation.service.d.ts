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
import { Model, Types } from 'mongoose';
import { UserSearchService, UserService } from 'src/modules/user/services';
import { PerformerService, PerformerSearchService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserDto } from 'src/modules/user/dtos';
import { StreamDto } from 'src/modules/stream/dtos';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerBlockService } from 'src/modules/block/services';
import { ConversationSearchPayload, ConversationUpdatePayload } from '../payloads';
import { ConversationDto } from '../dtos';
import { ConversationModel, NotificationMessageModel } from '../models';
export interface IRecipient {
    source: string;
    sourceId: Types.ObjectId;
}
export declare class ConversationService {
    private readonly performerService;
    private readonly userService;
    private readonly userSearchService;
    private readonly performerSearchService;
    private readonly subscriptionService;
    private readonly performerBlockService;
    private readonly conversationModel;
    private readonly socketService;
    private readonly notiticationMessageModel;
    constructor(performerService: PerformerService, userService: UserService, userSearchService: UserSearchService, performerSearchService: PerformerSearchService, subscriptionService: SubscriptionService, performerBlockService: PerformerBlockService, conversationModel: Model<ConversationModel>, socketService: SocketUserService, notiticationMessageModel: Model<NotificationMessageModel>);
    findOne(params: any): Promise<ConversationModel>;
    deleteOne(id: string | Types.ObjectId): Promise<any>;
    createStreamConversation(stream: StreamDto, recipients?: any[]): Promise<import("mongoose").Document<unknown, {}, ConversationModel> & Omit<ConversationModel & {
        _id: Types.ObjectId;
    }, never>>;
    createPrivateConversation(sender: IRecipient, receiver: IRecipient): Promise<ConversationDto>;
    updateConversationName(id: string, user: UserDto, payload: ConversationUpdatePayload): Promise<import("mongoose").Document<unknown, {}, ConversationModel> & Omit<ConversationModel & {
        _id: Types.ObjectId;
    }, never>>;
    getList(req: ConversationSearchPayload, sender: IRecipient, countryCode?: string): Promise<any>;
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, ConversationModel> & Omit<ConversationModel & {
        _id: Types.ObjectId;
    }, never>>;
    findPerformerPublicConversation(performerId: string | Types.ObjectId): Promise<import("mongoose").FlattenMaps<ConversationModel> & {
        _id: Types.ObjectId;
    }>;
    getPrivateConversationByStreamId(streamId: string | Types.ObjectId): Promise<ConversationDto>;
    addRecipient(conversationId: string | Types.ObjectId, recipient: IRecipient): Promise<void>;
    findByStreamIds(ids: any): Promise<(import("mongoose").FlattenMaps<ConversationModel> & {
        _id: Types.ObjectId;
    })[]>;
}
