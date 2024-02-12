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
import { DataResponse, PageableData } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { StreamService } from '../services/stream.service';
import { StartStreamPayload, SetDurationPayload, SearchStreamPayload, UpdateStreamPayload } from '../payloads';
import { StreamDto } from '../dtos';
export declare class StreamController {
    private readonly streamService;
    constructor(streamService: StreamService);
    getList(req: SearchStreamPayload): Promise<DataResponse<PageableData<StreamDto>>>;
    userList(req: SearchStreamPayload, user: UserDto): Promise<DataResponse<PageableData<StreamDto>>>;
    endSession(id: string): Promise<DataResponse<any>>;
    goLive(performer: PerformerDto, payload: StartStreamPayload): Promise<DataResponse<StreamDto>>;
    editLive(id: string, payload: UpdateStreamPayload): Promise<DataResponse<{
        _id: import("mongoose").Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: import("mongoose").Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: import("mongoose").Types.ObjectId;
        hasPurchased: boolean;
    } | {
        streamingTime: number;
        lastStreamingTime: Date;
        _id: import("mongoose").Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: import("mongoose").Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: import("mongoose").Types.ObjectId;
        hasPurchased: boolean;
    }>>;
    join(performerId: string, user: UserDto): Promise<DataResponse<{
        _id: import("mongoose").Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: import("mongoose").Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: import("mongoose").Types.ObjectId;
        hasPurchased: boolean;
    } | {
        streamingTime: number;
        lastStreamingTime: Date;
        _id: import("mongoose").Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: import("mongoose").Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: import("mongoose").Types.ObjectId;
        hasPurchased: boolean;
    }>>;
    setDuration(user: PerformerDto, payload: SetDurationPayload): Promise<DataResponse<any>>;
}
