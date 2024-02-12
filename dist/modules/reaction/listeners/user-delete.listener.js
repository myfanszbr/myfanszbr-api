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
exports.DeletePerformerReactionListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../performer/constants");
const providers_1 = require("../../feed/providers");
const providers_2 = require("../../performer-assets/providers");
const constants_3 = require("../../user/constants");
const lodash_1 = require("lodash");
const reaction_provider_1 = require("../providers/reaction.provider");
const DELETE_PERFORMER_REACTION_TOPIC = 'DELETE_PERFORMER_REACTION_TOPIC';
const DELETE_USER_REACTION_TOPIC = 'DELETE_USER_REACTION_TOPIC';
let DeletePerformerReactionListener = class DeletePerformerReactionListener {
    constructor(queueEventService, reactionModel, feedModel, productModel, galleryModel, videoModel) {
        this.queueEventService = queueEventService;
        this.reactionModel = reactionModel;
        this.feedModel = feedModel;
        this.productModel = productModel;
        this.galleryModel = galleryModel;
        this.videoModel = videoModel;
        this.queueEventService.subscribe(constants_2.DELETE_PERFORMER_CHANNEL, DELETE_PERFORMER_REACTION_TOPIC, this.handleDeletePerformer.bind(this));
        this.queueEventService.subscribe(constants_3.DELETE_USER_CHANNEL, DELETE_USER_REACTION_TOPIC, this.handleDeleteUser.bind(this));
    }
    async handleDeletePerformer(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const performer = event.data;
        await this.reactionModel.deleteMany({
            objectId: performer._id
        });
        const [feeds, videos, products, galleries] = await Promise.all([
            this.feedModel.find({ fromSourceId: performer._id }),
            this.videoModel.find({ performerId: performer._id }),
            this.productModel.find({ performerId: performer._id }),
            this.galleryModel.find({ performerId: performer._id })
        ]);
        const objectIds = (0, lodash_1.uniq)((0, lodash_1.flattenDeep)([
            feeds.map((f) => `${f._id}`),
            videos.map((v) => `${v._id}`),
            galleries.map((g) => `${g._id}`),
            products.map((p) => `${p.performerId}`)
        ]));
        objectIds.length && await this.reactionModel.deleteMany({
            objectId: { $in: objectIds }
        });
    }
    async handleDeleteUser(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const user = event.data;
        await this.reactionModel.deleteMany({
            createdBy: user._id
        });
    }
};
DeletePerformerReactionListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(reaction_provider_1.REACT_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_2.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_2.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(5, (0, common_1.Inject)(providers_2.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], DeletePerformerReactionListener);
exports.DeletePerformerReactionListener = DeletePerformerReactionListener;
//# sourceMappingURL=user-delete.listener.js.map