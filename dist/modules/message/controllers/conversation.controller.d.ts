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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CountryService } from 'src/modules/utils/services';
import { ConversationDto } from '../dtos';
import { ConversationService } from '../services/conversation.service';
import { ConversationCreatePayload, ConversationSearchPayload, ConversationUpdatePayload } from '../payloads';
export declare class ConversationController {
    private readonly conversationService;
    private readonly countryService;
    constructor(conversationService: ConversationService, countryService: CountryService);
    getListOfCurrentUser(query: ConversationSearchPayload, req: any): Promise<DataResponse<ConversationDto[]>>;
    getDetails(conversationId: string): Promise<DataResponse<any>>;
    findConversation(performerId: string): Promise<DataResponse<any>>;
    getByStream(streamId: string): Promise<DataResponse<any>>;
    create(payload: ConversationCreatePayload, user: any): Promise<DataResponse<ConversationDto>>;
    updateConversationName(id: string, payload: ConversationUpdatePayload, user: UserDto): Promise<DataResponse<import("mongoose").Document<unknown, {}, import("../models").ConversationModel> & Omit<import("../models").ConversationModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
}
