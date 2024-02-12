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
exports.DeleteUserListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../performer/constants");
const constants_3 = require("../../user/constants");
const services_1 = require("../../feed/services");
const services_2 = require("../../performer-assets/services");
const lodash_1 = require("lodash");
const comment_provider_1 = require("../providers/comment.provider");
const contants_1 = require("../contants");
const comment_dto_1 = require("../dtos/comment.dto");
const DELETE_PERFORMER_COMMENT_TOPIC = 'DELETE_PERFORMER_COMMENT_TOPIC';
const DELETE_USER_COMMENT_TOPIC = 'DELETE_USER_COMMENT_TOPIC';
let DeleteUserListener = class DeleteUserListener {
    constructor(feedService, videoService, galleryService, queueEventService, commentModel) {
        this.feedService = feedService;
        this.videoService = videoService;
        this.galleryService = galleryService;
        this.queueEventService = queueEventService;
        this.commentModel = commentModel;
        this.queueEventService.subscribe(constants_2.DELETE_PERFORMER_CHANNEL, DELETE_PERFORMER_COMMENT_TOPIC, this.handleDeletePerformer.bind(this));
        this.queueEventService.subscribe(constants_3.DELETE_USER_CHANNEL, DELETE_USER_COMMENT_TOPIC, this.handleDeleteUser.bind(this));
    }
    async handleDeletePerformer(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const performer = event.data;
        await this.commentModel.deleteMany({
            objectId: performer._id
        });
        await this.commentModel.deleteMany({
            createdBy: performer._id
        });
        const [feeds, videos, galleries] = await Promise.all([
            this.feedService.find({ fromSourceId: performer._id }),
            this.videoService.find({ performerId: performer._id }),
            this.galleryService.find({ performerId: performer._id })
        ]);
        const objectIds = (0, lodash_1.uniq)((0, lodash_1.flattenDeep)([
            feeds.map((f) => `${f._id}`),
            videos.map((v) => `${v._id}`),
            galleries.map((g) => `${g._id}`)
        ]));
        objectIds.length && await this.commentModel.deleteMany({
            objectId: { $in: objectIds }
        });
    }
    async handleDeleteUser(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const user = event.data;
        const comments = await this.commentModel.find({ createdBy: user._id });
        await comments.reduce(async (cb, comment) => {
            await cb;
            await this.commentModel.deleteOne({ _id: comment._id });
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: contants_1.COMMENT_CHANNEL,
                eventName: constants_1.EVENT.DELETED,
                data: new comment_dto_1.CommentDto(comment)
            }));
            return Promise.resolve();
        }, Promise.resolve());
    }
};
DeleteUserListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.FeedService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.VideoService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.GalleryService))),
    __param(4, (0, common_1.Inject)(comment_provider_1.COMMENT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.FeedService,
        services_2.VideoService,
        services_2.GalleryService,
        kernel_1.QueueEventService,
        mongoose_1.Model])
], DeleteUserListener);
exports.DeleteUserListener = DeleteUserListener;
//# sourceMappingURL=user-delete.listener.js.map