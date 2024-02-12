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
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { TokenTransactionSearchService, TokenTransactionService } from 'src/modules/token-transaction/services';
import { UserDto } from 'src/modules/user/dtos';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { BlockService } from 'src/modules/block/services';
import { FeedDto, PollDto } from '../dtos';
import { FeedCreatePayload, FeedSearchRequest, PollCreatePayload } from '../payloads';
import { FeedModel, PollModel, VoteModel, ScheduledStreamNotificationModel } from '../models';
export declare class FeedService {
    private readonly followService;
    private readonly performerService;
    private readonly tokenTransactionSearchService;
    private readonly paymentTokenService;
    private readonly reactionService;
    private readonly subscriptionService;
    private readonly fileService;
    private readonly PollVoteModel;
    private readonly voteModel;
    private readonly scheduledStreamNotificationModel;
    private readonly feedModel;
    private readonly queueEventService;
    private readonly blockService;
    constructor(followService: FollowService, performerService: PerformerService, tokenTransactionSearchService: TokenTransactionSearchService, paymentTokenService: TokenTransactionService, reactionService: ReactionService, subscriptionService: SubscriptionService, fileService: FileService, PollVoteModel: Model<PollModel>, voteModel: Model<VoteModel>, scheduledStreamNotificationModel: Model<ScheduledStreamNotificationModel>, feedModel: Model<FeedModel>, queueEventService: QueueEventService, blockService: BlockService);
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, FeedModel> & Omit<FeedModel & Required<{
        _id: Types.ObjectId;
    }>, never>)[]>;
    findById(id: any): Promise<import("mongoose").Document<unknown, {}, FeedModel> & Omit<FeedModel & Required<{
        _id: Types.ObjectId;
    }>, never>>;
    findByIds(ids: string[] | Types.ObjectId[]): Promise<(import("mongoose").Document<unknown, {}, FeedModel> & Omit<FeedModel & Required<{
        _id: Types.ObjectId;
    }>, never>)[]>;
    handleCommentStat(feedId: string | Types.ObjectId, num?: number): Promise<void>;
    private _validatePayload;
    populateFeedData(feeds: any, user: UserDto, jwToken?: string): Promise<any>;
    findOne(id: string, user: UserDto, jwToken: string): Promise<FeedDto>;
    create(payload: FeedCreatePayload, user: UserDto): Promise<any>;
    updateFeed(id: string, user: UserDto, payload: FeedCreatePayload): Promise<any>;
    deleteFeed(id: string, user: UserDto): Promise<{
        success: boolean;
    }>;
    search(req: FeedSearchRequest, user: UserDto, jwToken: string): Promise<{
        data: any;
        total: number;
    }>;
    userSearchFeeds(req: FeedSearchRequest, user: UserDto, jwToken: string): Promise<{
        data: any;
        total: number;
    }>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
    createPoll(payload: PollCreatePayload, user: UserDto): Promise<PollDto>;
    votePollFeed(pollId: string | Types.ObjectId, user: UserDto): Promise<any>;
}
