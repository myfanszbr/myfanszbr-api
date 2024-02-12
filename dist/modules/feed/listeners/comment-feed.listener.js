"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFeedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const contants_1 = require("../../comment/contants");
const constants_1 = require("../../../kernel/constants");
const comment_service_1 = require("../../comment/services/comment.service");
const feed_service_1 = require("../services/feed.service");
const COMMENT_FEED_CHANNEL = 'COMMENT_FEED_CHANNEL';
let CommentFeedListener = class CommentFeedListener {
    constructor(commentService, queueEventService, feedService) {
        this.commentService = commentService;
        this.queueEventService = queueEventService;
        this.feedService = feedService;
        this.queueEventService.subscribe(contants_1.COMMENT_CHANNEL, COMMENT_FEED_CHANNEL, this.handleCommentFeed.bind(this));
    }
    async handleCommentFeed(event) {
        if (![constants_1.EVENT.CREATED, constants_1.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { objectId: feedId, objectType } = event.data;
        if (objectType === contants_1.OBJECT_TYPE.FEED) {
            await this.feedService.handleCommentStat(feedId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
        }
        else if (objectType === contants_1.OBJECT_TYPE.COMMENT) {
            const comment = await this.commentService.findById(feedId);
            if (comment) {
                await this.feedService.handleCommentStat(comment.objectId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
            }
        }
    }
};
CommentFeedListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => comment_service_1.CommentService))),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        kernel_1.QueueEventService,
        feed_service_1.FeedService])
], CommentFeedListener);
exports.CommentFeedListener = CommentFeedListener;
//# sourceMappingURL=comment-feed.listener.js.map