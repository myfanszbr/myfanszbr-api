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
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { MessageModel, IRecipient } from '../models';
import { MessageCreatePayload } from '../payloads/message-create.payload';
import { MessageDto } from '../dtos';
import { ConversationService } from './conversation.service';
import { MessageListRequest } from '../payloads/message-list.payload';
export declare class MessageService {
    private readonly performerService;
    private readonly userService;
    private readonly conversationService;
    private readonly messageModel;
    private readonly queueEventService;
    private readonly fileService;
    constructor(performerService: PerformerService, userService: UserService, conversationService: ConversationService, messageModel: Model<MessageModel>, queueEventService: QueueEventService, fileService: FileService);
    validatePhotoFile(file: FileDto, isPublic?: boolean): Promise<void>;
    validateVideoFile(video: FileDto): Promise<any>;
    createPrivateMessage(conversationId: string | Types.ObjectId, payload: MessageCreatePayload, sender: IRecipient, jwToken: string): Promise<MessageDto>;
    loadPrivateMessages(req: MessageListRequest, user: UserDto, jwToken: string): Promise<{
        data: MessageDto[];
        total: number;
    }>;
    deleteMessage(messageId: string, user: UserDto): Promise<import("mongoose").Document<unknown, {}, MessageModel> & Omit<MessageModel & {
        _id: Types.ObjectId;
    }, never>>;
    loadPublicMessages(req: MessageListRequest): Promise<{
        data: MessageDto[];
        total: number;
    }>;
    createStreamMessageFromConversation(conversationId: string, payload: MessageCreatePayload, sender: IRecipient, user: UserDto): Promise<MessageDto>;
    deleteAllMessageInConversation(conversationId: string, user: any): Promise<{
        success: boolean;
    }>;
}
