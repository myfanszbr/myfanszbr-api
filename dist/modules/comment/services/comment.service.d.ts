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
import { QueueEventService, PageableData } from 'src/kernel';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { FeedService } from 'src/modules/feed/services';
import { MailerService } from 'src/modules/mailer';
import { VideoService } from 'src/modules/performer-assets/services';
import { CommentModel } from '../models/comment.model';
import { CommentCreatePayload, CommentEditPayload, CommentSearchRequestPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { CommentDto } from '../dtos/comment.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class CommentService {
    private readonly videoService;
    private readonly performerService;
    private readonly userService;
    private readonly feedService;
    private readonly commentModel;
    private readonly queueEventService;
    private readonly reactionService;
    private readonly mailerService;
    constructor(videoService: VideoService, performerService: PerformerService, userService: UserService, feedService: FeedService, commentModel: Model<CommentModel>, queueEventService: QueueEventService, reactionService: ReactionService, mailerService: MailerService);
    increaseComment(commentId: any, num?: number): Promise<void>;
    create(data: CommentCreatePayload, user: UserDto): Promise<CommentDto>;
    findById(id: any): Promise<import("mongoose").Document<unknown, {}, CommentModel> & Omit<CommentModel & {
        _id: Types.ObjectId;
    }, never>>;
    update(id: string | Types.ObjectId, payload: CommentEditPayload, user: UserDto): Promise<any>;
    delete(id: string | Types.ObjectId, user: UserDto): Promise<import("mongoose").Document<unknown, {}, CommentModel> & Omit<CommentModel & {
        _id: Types.ObjectId;
    }, never>>;
    findByIds(ids: any[]): Promise<CommentDto[]>;
    search(req: CommentSearchRequestPayload, user: UserDto): Promise<PageableData<CommentDto>>;
}
