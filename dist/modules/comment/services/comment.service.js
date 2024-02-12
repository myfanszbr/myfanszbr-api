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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const dtos_1 = require("../../performer/dtos");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const services_1 = require("../../feed/services");
const mailer_1 = require("../../mailer");
const services_2 = require("../../performer-assets/services");
const comment_provider_1 = require("../providers/comment.provider");
const dtos_2 = require("../../user/dtos");
const comment_dto_1 = require("../dtos/comment.dto");
const services_3 = require("../../user/services");
const services_4 = require("../../performer/services");
const contants_1 = require("../contants");
let CommentService = class CommentService {
    constructor(videoService, performerService, userService, feedService, commentModel, queueEventService, reactionService, mailerService) {
        this.videoService = videoService;
        this.performerService = performerService;
        this.userService = userService;
        this.feedService = feedService;
        this.commentModel = commentModel;
        this.queueEventService = queueEventService;
        this.reactionService = reactionService;
        this.mailerService = mailerService;
    }
    async increaseComment(commentId, num = 1) {
        await this.commentModel.updateOne({ _id: commentId }, { $inc: { totalReply: num } });
    }
    async create(data, user) {
        const comment = Object.assign({}, data);
        comment.createdBy = user._id;
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        let resp;
        let link = '#';
        switch (comment.objectType) {
            case contants_1.OBJECT_TYPE.FEED:
                resp = await this.feedService.findById(comment.objectId);
                comment.recipientId = resp.fromSourceId;
                link = `${process.env.USER_URL}/post/${comment.objectId}`;
                break;
            case contants_1.OBJECT_TYPE.VIDEO:
                resp = await this.videoService.findById(comment.objectId);
                comment.recipientId = resp.performerId;
                link = `${process.env.USER_URL}/video/${comment.objectId}`;
                break;
            case contants_1.OBJECT_TYPE.COMMENT:
                resp = await this.findById(comment.objectId);
                comment.recipientId = resp.recipientId;
                break;
            default:
                break;
        }
        const newComment = await this.commentModel.create(comment);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: contants_1.COMMENT_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new comment_dto_1.CommentDto(newComment)
        }));
        const [performerInfo, userInfo, performer] = await Promise.all([
            this.performerService.findById(user._id),
            this.userService.findById(user._id),
            comment.recipientId && this.performerService.findById(comment.recipientId)
        ]);
        (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
            subject: 'New comment',
            to: performer === null || performer === void 0 ? void 0 : performer.email,
            data: {
                contentType: comment.objectType,
                userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                link
            },
            template: 'performer-comment-content'
        });
        const returnData = new comment_dto_1.CommentDto(newComment);
        returnData.creator = (userInfo && new dtos_2.UserDto(userInfo).toResponse()) || (performerInfo && new dtos_1.PerformerDto(performerInfo).toResponse());
        return returnData;
    }
    async findById(id) {
        const data = await this.commentModel.findById(id);
        return data;
    }
    async update(id, payload, user) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (comment.createdBy.toString() !== user._id.toString()) {
            throw new kernel_1.ForbiddenException();
        }
        await this.commentModel.updateOne({ _id: id }, data);
        return { updated: true };
    }
    async delete(id, user) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!user.isPerformer && (comment.createdBy.toString() !== user._id.toString())) {
            throw new kernel_1.ForbiddenException();
        }
        await this.commentModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: contants_1.COMMENT_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new comment_dto_1.CommentDto(comment)
        }));
        return comment;
    }
    async findByIds(ids) {
        const users = await this.commentModel
            .find({ _id: { $in: ids } })
            .lean()
            .exec();
        return users.map((u) => new comment_dto_1.CommentDto(u));
    }
    async search(req, user) {
        const query = {};
        if (req.objectId) {
            query.objectId = req.objectId;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.commentModel
                .find(query)
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.commentModel.countDocuments(query)
        ]);
        const comments = data.map((d) => new comment_dto_1.CommentDto(d));
        const commentIds = data.map((d) => d._id);
        const UIds = data.map((d) => d.createdBy);
        const [users, performers, reactions] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            UIds.length ? this.performerService.findByIds(UIds) : [],
            user && commentIds.length ? this.reactionService.findByQuery({ objectId: { $in: commentIds }, createdBy: user._id }) : []
        ]);
        comments.forEach((comment) => {
            const performer = performers.find((p) => p._id.toString() === comment.createdBy.toString());
            const userComment = users.find((u) => u._id.toString() === comment.createdBy.toString());
            const liked = reactions.find((reaction) => reaction.objectId.toString() === comment._id.toString());
            comment.creator = performer
                ? new dtos_1.PerformerDto(performer).toSearchResponse()
                : (userComment ? new dtos_2.UserDto(userComment).toResponse() : null);
            comment.isLiked = !!liked;
            comment.isAuth = `${user._id}` === `${comment.recipientId}` || `${user._id}` === `${comment.createdBy}`;
        });
        return {
            data: comments,
            total
        };
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.VideoService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.FeedService))),
    __param(4, (0, common_1.Inject)(comment_provider_1.COMMENT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.VideoService,
        services_4.PerformerService,
        services_3.UserService,
        services_1.FeedService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        reaction_service_1.ReactionService,
        mailer_1.MailerService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map