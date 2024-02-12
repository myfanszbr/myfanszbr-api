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
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { MessageService, NotificationMessageService } from '../services';
import { MessageListRequest, MessageCreatePayload } from '../payloads';
import { MessageDto } from '../dtos';
export declare class MessageController {
    private readonly messageService;
    private readonly notificationMessageService;
    constructor(messageService: MessageService, notificationMessageService: NotificationMessageService);
    validatePublicPhoto(file: FileDto): Promise<DataResponse<{
        url: string;
        _id?: import("mongoose").Types.ObjectId;
        type?: string;
        name?: string;
        description?: string;
        mimeType?: string;
        server?: string;
        path?: string;
        absolutePath?: string;
        width?: number;
        height?: number;
        duration?: number;
        size?: number;
        status?: string;
        encoding?: string;
        thumbnails?: Record<string, any>[];
        refItems: any;
        acl?: string;
        metadata?: any;
        createdBy?: import("mongoose").Types.ObjectId;
        updatedBy?: import("mongoose").Types.ObjectId;
        createdAt?: Date;
        updatedAt?: Date;
    }>>;
    createVideoFileMessage(file: FileDto): Promise<DataResponse<{
        url: string;
        _id?: import("mongoose").Types.ObjectId;
        type?: string;
        name?: string;
        description?: string;
        mimeType?: string;
        server?: string;
        path?: string;
        absolutePath?: string;
        width?: number;
        height?: number;
        duration?: number;
        size?: number;
        status?: string;
        encoding?: string;
        thumbnails?: Record<string, any>[];
        refItems: any;
        acl?: string;
        metadata?: any;
        createdBy?: import("mongoose").Types.ObjectId;
        updatedBy?: import("mongoose").Types.ObjectId;
        createdAt?: Date;
        updatedAt?: Date;
    }>>;
    readAllMessage(conversationId: string, user: UserDto): Promise<DataResponse<MessageDto>>;
    countTotalNotReadMessage(user: UserDto): Promise<DataResponse<any>>;
    loadMessages(query: MessageListRequest, conversationId: string, user: UserDto, req: any): Promise<DataResponse<any>>;
    createMessage(payload: MessageCreatePayload, conversationId: string, req: any): Promise<DataResponse<any>>;
    createStreamMessage(payload: MessageCreatePayload, conversationId: string, req: any, user: UserDto): Promise<DataResponse<any>>;
    deleteMessage(messageId: string, user: UserDto): Promise<DataResponse<any>>;
    deleteAllPublicMessage(conversationId: string, user: any): Promise<DataResponse<any>>;
    loadPublicMessages(req: MessageListRequest, conversationId: string): Promise<DataResponse<any>>;
}
