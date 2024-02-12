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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_3 = require("../../block/services");
const dtos_3 = require("../dtos");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
let ConversationService = class ConversationService {
    constructor(performerService, userService, userSearchService, performerSearchService, subscriptionService, performerBlockService, conversationModel, socketService, notiticationMessageModel) {
        this.performerService = performerService;
        this.userService = userService;
        this.userSearchService = userSearchService;
        this.performerSearchService = performerSearchService;
        this.subscriptionService = subscriptionService;
        this.performerBlockService = performerBlockService;
        this.conversationModel = conversationModel;
        this.socketService = socketService;
        this.notiticationMessageModel = notiticationMessageModel;
    }
    async findOne(params) {
        return this.conversationModel.findOne(params);
    }
    async deleteOne(id) {
        return this.conversationModel.deleteOne({ _id: id });
    }
    async createStreamConversation(stream, recipients = []) {
        return this.conversationModel.create({
            streamId: stream._id,
            performerId: stream.performerId,
            recipients: recipients || [],
            name: `${stream.type} stream session ${stream.sessionId}`,
            type: `stream_${stream.type}`,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    async createPrivateConversation(sender, receiver) {
        let conversation = await this.conversationModel
            .findOne({
            type: constants_1.CONVERSATION_TYPE.PRIVATE,
            recipients: {
                $all: [
                    {
                        source: sender.source,
                        sourceId: (0, string_helper_1.toObjectId)(sender.sourceId)
                    },
                    {
                        source: receiver.source,
                        sourceId: (0, string_helper_1.toObjectId)(receiver.sourceId)
                    }
                ]
            }
        })
            .lean()
            .exec();
        if (!conversation) {
            conversation = await this.conversationModel.create({
                type: constants_1.CONVERSATION_TYPE.PRIVATE,
                recipients: [sender, receiver],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        const dto = new dtos_3.ConversationDto(conversation);
        dto.totalNotSeenMessages = 0;
        if (receiver.source === 'performer') {
            const per = await this.performerService.findById(receiver.sourceId);
            if (per) {
                dto.recipientInfo = new dtos_2.PerformerDto(per).toResponse(false);
                const subscribed = await this.subscriptionService.checkSubscribed(per._id, sender.sourceId);
                dto.isSubscribed = !!subscribed;
            }
        }
        if (receiver.source === 'user') {
            dto.isSubscribed = true;
            const user = await this.userService.findById(receiver.sourceId);
            if (user)
                dto.recipientInfo = new dtos_1.UserDto(user).toResponse(false);
        }
        return dto;
    }
    async updateConversationName(id, user, payload) {
        const conversation = await this.conversationModel.findById(id);
        if (!conversation)
            throw new kernel_1.EntityNotFoundException();
        if (`${conversation.performerId}` !== `${user._id}`)
            throw new common_1.ForbiddenException();
        conversation.name = payload.name;
        await conversation.save();
        if (conversation.streamId) {
            await this.socketService.emitToRoom(`conversation-${conversation.type}-${conversation._id}`, 'change-stream-info', { conversation });
        }
        return conversation;
    }
    async getList(req, sender, countryCode) {
        let query = {
            recipients: {
                $elemMatch: {
                    source: sender.source,
                    sourceId: (0, string_helper_1.toObjectId)(sender.sourceId)
                }
            }
        };
        if (req.keyword) {
            let usersSearch = null;
            if (sender.source === 'user') {
                usersSearch = await this.performerSearchService.searchByKeyword({ q: req.keyword });
            }
            if (sender.source === 'performer') {
                usersSearch = await this.userSearchService.searchByKeyword({ q: req.keyword });
            }
            const Ids = usersSearch ? usersSearch.map((u) => u._id) : [];
            query = {
                $and: [{
                        recipients: {
                            $elemMatch: {
                                source: sender.source === 'user' ? 'performer' : 'user',
                                sourceId: { $in: Ids }
                            }
                        }
                    },
                    {
                        recipients: {
                            $elemMatch: {
                                source: sender.source,
                                sourceId: (0, string_helper_1.toObjectId)(sender.sourceId)
                            }
                        }
                    }]
            };
        }
        if (req.type) {
            query.type = req.type;
        }
        const [data, total] = await Promise.all([
            this.conversationModel
                .find(query)
                .lean()
                .limit(req.limit)
                .skip(req.offset)
                .sort({ lastMessageCreatedAt: -1, updatedAt: -1 }),
            this.conversationModel.countDocuments(query)
        ]);
        const conversations = data.map((d) => new dtos_3.ConversationDto(d));
        const recipientIds = conversations.map((c) => {
            const re = c.recipients.find((rep) => rep.sourceId.toString() !== sender.sourceId.toString());
            if (re) {
                return re.sourceId;
            }
            return null;
        });
        const conversationIds = data.map((d) => d._id);
        let subscriptions = [];
        let blockedUsers = null;
        let blockCountries = [];
        const [notifications] = await Promise.all([
            this.notiticationMessageModel.find({
                conversationId: { $in: conversationIds },
                recipientId: sender.sourceId
            })
        ]);
        const recipients = (sender.source === 'user' ? await this.performerService.findByIds(recipientIds) : await this.userService.findByIds(recipientIds)) || [];
        if (sender.source === 'user') {
            if (recipients) {
                const pIds = recipients.map((p) => p._id);
                subscriptions = await this.subscriptionService.findSubscriptionList({
                    performerId: { $in: pIds },
                    userId: sender.sourceId,
                    expiredAt: { $gt: new Date() }
                });
                blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ sourceId: { $in: pIds } });
                blockedUsers = await this.performerBlockService.listByQuery({ sourceId: { $in: pIds }, targetId: sender.sourceId });
            }
        }
        conversations.forEach((conversation) => {
            const recipient = conversation.recipients.find((rep) => `${rep.sourceId}` !== `${sender.sourceId}`);
            if (recipient) {
                conversation.isSubscribed = sender.source === 'performer';
                const recipientInfo = recipients.find((r) => `${r._id}` === `${recipient.sourceId}`);
                if (recipientInfo) {
                    conversation.recipientInfo = recipient.source === 'user' ? new dtos_1.UserDto(recipientInfo).toResponse() : new dtos_2.PerformerDto(recipientInfo).toResponse();
                    if (sender.source === 'user') {
                        let isBlocked = false;
                        if (blockedUsers.length) {
                            const isBlockedUser = blockedUsers.find((s) => `${s.sourceId}` === `${recipient.sourceId}`);
                            isBlocked = !!isBlockedUser;
                        }
                        if (countryCode && !isBlocked) {
                            const isBlockeCountry = blockCountries.find((b) => `${b.sourceId}` === `${recipient.sourceId}` && b.countryCodes.includes(countryCode));
                            isBlocked = !!isBlockeCountry;
                        }
                        const isSubscribed = subscriptions.find((s) => `${s.performerId}` === `${recipientInfo._id}`);
                        conversation.isSubscribed = !!isSubscribed;
                        conversation.isBlocked = !!isBlocked;
                    }
                }
                conversation.totalNotSeenMessages = 0;
                if (notifications.length) {
                    const conversationNotifications = notifications.find((n) => n.conversationId.toString() === conversation._id.toString());
                    conversation.totalNotSeenMessages = (conversationNotifications === null || conversationNotifications === void 0 ? void 0 : conversationNotifications.totalNotReadMessage) || 0;
                }
            }
        });
        return {
            data: conversations,
            total
        };
    }
    async findById(id) {
        const conversation = await this.conversationModel.findById(id);
        return conversation;
    }
    async findPerformerPublicConversation(performerId) {
        const data = await this.conversationModel
            .findOne({
            type: `stream_${constants_1.CONVERSATION_TYPE.PUBLIC}`,
            performerId
        })
            .lean()
            .exec();
        return data;
    }
    async getPrivateConversationByStreamId(streamId) {
        const conversation = await this.conversationModel.findOne({ streamId });
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_3.ConversationDto(conversation);
    }
    async addRecipient(conversationId, recipient) {
        await this.conversationModel.updateOne({ _id: conversationId }, { $addToSet: { recipients: recipient } });
    }
    async findByStreamIds(ids) {
        return this.conversationModel.find({ streamId: { $in: ids } }).lean();
    }
};
ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserSearchService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerSearchService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.PerformerBlockService))),
    __param(6, (0, common_1.Inject)(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(8, (0, common_1.Inject)(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        services_1.UserSearchService,
        services_2.PerformerSearchService,
        subscription_service_1.SubscriptionService,
        services_3.PerformerBlockService,
        mongoose_1.Model,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model])
], ConversationService);
exports.ConversationService = ConversationService;
//# sourceMappingURL=conversation.service.js.map