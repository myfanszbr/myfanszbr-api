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
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const uuid_1 = require("uuid");
const services_2 = require("../../message/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const dtos_1 = require("../../performer/dtos");
const moment = require("moment");
const lodash_1 = require("lodash");
const services_3 = require("../../user/services");
const services_4 = require("../../token-transaction/services");
const constants_1 = require("../../token-transaction/constants");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../constant");
const stream_provider_1 = require("../providers/stream.provider");
const exceptions_1 = require("../exceptions");
const dtos_2 = require("../dtos");
let StreamService = class StreamService {
    constructor(performerService, userService, subscriptionService, streamModel, conversationService, socketUserService, tokenTransactionService) {
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.streamModel = streamModel;
        this.conversationService = conversationService;
        this.socketUserService = socketUserService;
        this.tokenTransactionService = tokenTransactionService;
    }
    async findOne(query) {
        const stream = await this.streamModel.findOne(query);
        return stream;
    }
    async findByIds(ids) {
        const streams = await this.streamModel.find({ _id: { $in: ids } });
        return streams;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [{ title: searchValue }, { description: searchValue }];
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.isFree) {
            query.isFree = req.isFree === 'true';
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const sort = {
            isStreaming: -1,
            updatedAt: -1,
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.streamModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.streamModel.countDocuments(query)
        ]);
        const performerIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const streams = data.map((d) => new dtos_2.StreamDto(d));
        const [performers] = await Promise.all([
            this.performerService.findByIds(performerIds)
        ]);
        streams.forEach((stream) => {
            const performer = stream.performerId
                && performers.find((p) => `${p._id}` === `${stream.performerId}`);
            stream.performerInfo = performer
                ? new dtos_1.PerformerDto(performer).toResponse()
                : null;
        });
        return {
            data: streams,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            isStreaming: 1
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [{ title: searchValue }, { description: searchValue }];
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.isFree) {
            query.isFree = req.isFree === 'true';
        }
        const sort = { updatedAt: -1, createdAt: -1 };
        const [data, total] = await Promise.all([
            this.streamModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.streamModel.countDocuments(query)
        ]);
        const performerIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const streams = data.map((d) => new dtos_2.StreamDto(d));
        const [performers, subscriptions, conversations] = await Promise.all([
            this.performerService.findByIds(performerIds),
            user ? this.subscriptionService.findSubscriptionList({
                performerId: { $in: performerIds },
                userId: user._id
            }) : [],
            this.conversationService.findByStreamIds(streams.map((s) => s._id))
        ]);
        streams.forEach((stream) => {
            const performer = stream.performerId
                && performers.find((p) => `${p._id}` === `${stream.performerId}`);
            const subscription = subscriptions.find((s) => `${s.performerId}` === `${stream.performerId}`);
            stream.performerInfo = performer
                ? new dtos_1.PerformerDto(performer).toResponse()
                : null;
            stream.isSubscribed = subscription && moment().isBefore(subscription.expiredAt);
            const conversation = conversations.find((c) => `${c.streamId}` === `${stream._id}`);
            stream.conversationId = conversation && conversation._id;
        });
        return {
            data: streams,
            total
        };
    }
    async endSessionStream(streamId) {
        const stream = await this.streamModel.findOne({ _id: streamId });
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!stream.isStreaming) {
            throw new exceptions_1.StreamOfflineException();
        }
        const conversation = await this.conversationService.findOne({
            streamId: stream._id
        });
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const roomName = this.getRoomName(conversation._id, conversation.type);
        await this.socketUserService.emitToRoom(roomName, 'admin-end-session-stream', {
            streamId: stream._id,
            conversationId: conversation._id,
            createdAt: new Date()
        });
        return { ended: true };
    }
    async findByPerformerId(performerId, payload) {
        return this.streamModel.findOne(Object.assign({ performerId }, payload));
    }
    async goLive(payload, performer) {
        const { price, isFree, title, description } = payload;
        let stream = await this.streamModel.findOne({
            performerId: performer._id,
            type: constant_1.PUBLIC_CHAT
        });
        const sessionId = (0, uuid_1.v4)();
        if (!stream) {
            stream = new this.streamModel({
                sessionId,
                performerId: performer._id,
                type: constant_1.PUBLIC_CHAT
            });
        }
        stream.sessionId = sessionId;
        stream.streamingTime = 0;
        stream.isStreaming = 0;
        stream.isFree = isFree;
        stream.price = isFree ? 0 : price;
        stream.title = title;
        stream.description = description;
        stream.stats = { members: 0, likes: 0 };
        await stream.save();
        const dto = new dtos_2.StreamDto(stream);
        let conversation = await this.conversationService.findOne({
            type: `stream_${constant_1.PUBLIC_CHAT}`,
            performerId: performer._id,
            streamId: stream._id
        });
        if (!conversation) {
            conversation = await this.conversationService.createStreamConversation(dto);
        }
        dto.conversationId = conversation._id;
        return dto;
    }
    async editLive(id, payload) {
        const stream = await this.streamModel.findById(id);
        if (!stream)
            throw new kernel_1.EntityNotFoundException();
        (0, lodash_1.merge)(stream, payload);
        await stream.save();
        return new dtos_2.StreamDto(stream).toResponse(true);
    }
    async joinPublicChat(performerId, user) {
        const stream = await this.streamModel
            .findOne({
            performerId,
            type: constant_1.PUBLIC_CHAT
        })
            .lean();
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!stream.isStreaming) {
            throw new exceptions_1.StreamOfflineException();
        }
        const conversation = await this.conversationService.findOne({
            type: `stream_${constant_1.PUBLIC_CHAT}`,
            performerId: stream.performerId,
            streamId: stream._id
        });
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [hasSubscribed, hasPurchased] = await Promise.all([
            this.subscriptionService.checkSubscribed(performerId, user._id),
            !stream.isFree ? this.tokenTransactionService.findOne({
                status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS,
                sourceId: user._id,
                sessionId: stream.sessionId
            }) : false
        ]);
        if (!hasSubscribed)
            throw new common_1.ForbiddenException('Please subscribe to join creator\'s live');
        const dto = new dtos_2.StreamDto(stream).toResponse();
        dto.hasPurchased = !!hasPurchased;
        dto.conversationId = conversation._id;
        return dto;
    }
    getRoomName(id, roomType) {
        return `conversation-${roomType}-${id}`;
    }
    async updateStreamDuration(payload, performer) {
        const { streamId, duration } = payload;
        const stream = await this.streamModel.findById(streamId);
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (`${performer._id}` !== `${stream.performerId}`) {
            throw new common_1.ForbiddenException();
        }
        if (stream.streamingTime >= duration) {
            return { updated: true };
        }
        stream.streamingTime = duration;
        await stream.save();
        return { updated: true };
    }
};
StreamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(3, (0, common_1.Inject)(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.TokenTransactionService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_3.UserService,
        subscription_service_1.SubscriptionService,
        mongoose_1.Model,
        services_2.ConversationService,
        socket_user_service_1.SocketUserService,
        services_4.TokenTransactionService])
], StreamService);
exports.StreamService = StreamService;
//# sourceMappingURL=stream.service.js.map