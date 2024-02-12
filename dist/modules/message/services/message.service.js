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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../file/services");
const constants_1 = require("../../file/constants");
const contants_1 = require("../../storage/contants");
const services_2 = require("../../performer/services");
const services_3 = require("../../user/services");
const dtos_2 = require("../../performer/dtos");
const lodash_1 = require("lodash");
const message_provider_1 = require("../providers/message.provider");
const constants_2 = require("../constants");
const dtos_3 = require("../dtos");
const conversation_service_1 = require("./conversation.service");
let MessageService = class MessageService {
    constructor(performerService, userService, conversationService, messageModel, queueEventService, fileService) {
        this.performerService = performerService;
        this.userService = userService;
        this.conversationService = conversationService;
        this.messageModel = messageModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
    }
    async validatePhotoFile(file, isPublic = false) {
        if (!file.isImage()) {
            await this.fileService.remove(file._id);
            throw new common_1.HttpException('Invalid photo file', 422);
        }
        await this.fileService.queueProcessPhoto(file._id, {
            thumbnailSize: !isPublic ? (0, kernel_1.getConfig)('image').blurThumbnail : (0, kernel_1.getConfig)('image').originThumbnail
        });
    }
    async validateVideoFile(video) {
        if (!video.isVideo()) {
            await this.fileService.remove(video._id);
            throw new common_1.HttpException('Invalid video file', 422);
        }
        await this.fileService.queueProcessVideo(video._id, {
            count: 1
        });
        return true;
    }
    async createPrivateMessage(conversationId, payload, sender, jwToken) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find((recipient) => recipient.sourceId.toString() === sender.sourceId.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        if (message.fileIds && message.fileIds.length) {
            message.fileIds.map((fileId) => this.fileService.addRef(fileId, {
                itemId: message._id,
                itemType: constants_1.REF_TYPE.MESSAGE
            }));
        }
        const files = message.fileIds ? await this.fileService.findByIds(message.fileIds) : [];
        const dto = new dtos_3.MessageDto(message);
        dto.files = files && files.length > 0 && files.map((file) => {
            let fileUrl = file.getUrl(true);
            if (file.server !== contants_1.Storage.S3) {
                fileUrl = `${file.getUrl()}?messageId=${message._id}&token=${jwToken}`;
            }
            return Object.assign(Object.assign({}, file.toResponse()), { thumbnails: file.getThumbnails(), url: fileUrl });
        });
        await this.queueEventService.publish({
            channel: constants_2.MESSAGE_CHANNEL,
            eventName: constants_2.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async loadPrivateMessages(req, user, jwToken) {
        const conversation = await this.conversationService.findById(req.conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find((recipient) => recipient.sourceId.toString() === user._id.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        const query = { conversationId: conversation._id };
        const [data, total] = await Promise.all([
            this.messageModel
                .find(query)
                .sort({ createdAt: -1 })
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.messageModel.countDocuments(query)
        ]);
        const fileIds = (0, lodash_1.uniq)((0, lodash_1.flatten)(data.map((d) => d === null || d === void 0 ? void 0 : d.fileIds)));
        const files = fileIds && await this.fileService.findByIds(fileIds);
        const messages = data.map((m) => new dtos_3.MessageDto(m));
        messages.forEach((m) => {
            var _a;
            if ((m === null || m === void 0 ? void 0 : m.fileIds) && ((_a = m.fileIds) === null || _a === void 0 ? void 0 : _a.length) > 0 && files && files.length > 0) {
                const _files = files.filter((f) => (`${m.fileIds}`).includes(`${f._id}`));
                m.files = _files.map((file) => {
                    let fileUrl = file.getUrl(true);
                    if (file.server !== contants_1.Storage.S3) {
                        fileUrl = `${file.getUrl()}?messageId=${m._id}&token=${jwToken}`;
                    }
                    return Object.assign(Object.assign({}, file.toResponse()), { thumbnails: file.getThumbnails(), url: fileUrl });
                });
            }
        });
        return {
            data: messages,
            total
        };
    }
    async deleteMessage(messageId, user) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.roles
            && !user.roles.includes('admin')
            && message.senderId.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        if (message.conversationId) {
            const conversation = await this.conversationService.findById(message.conversationId);
            const channel = (conversation.type === constants_2.CONVERSATION_TYPE.PRIVATE) ? constants_2.MESSAGE_CHANNEL : constants_2.MESSAGE_PRIVATE_STREAM_CHANNEL;
            const data = (conversation.type === constants_2.CONVERSATION_TYPE.PRIVATE) ? message : { message, conversation };
            await Promise.all([
                this.queueEventService.publish({
                    channel,
                    eventName: constants_2.MESSAGE_EVENT.DELETED,
                    data
                }),
                this.queueEventService.publish({
                    channel: constants_2.DELETE_MESSAGE_CHANNEL,
                    eventName: constants_2.MESSAGE_EVENT.DELETED,
                    data: {
                        messageId: message._id
                    }
                })
            ]);
        }
        return message;
    }
    async loadPublicMessages(req) {
        const conversation = await this.conversationService.findById(req.conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const query = { conversationId: conversation._id };
        const [data, total] = await Promise.all([
            this.messageModel
                .find(query)
                .sort({ createdAt: -1 })
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.messageModel.countDocuments(query)
        ]);
        const senderIds = data.map((d) => d.senderId);
        const [users, performers] = await Promise.all([
            senderIds.length ? this.userService.findByIds(senderIds) : [],
            senderIds.length ? this.performerService.findByIds(senderIds) : []
        ]);
        const messages = data.map((message) => {
            let user = null;
            user = users.find((u) => u._id.toString() === message.senderId.toString());
            if (!user) {
                user = performers.find((p) => p._id.toString() === message.senderId.toString());
            }
            return Object.assign(Object.assign({}, message), { senderInfo: user ? new dtos_1.UserDto(user).toResponse() : new dtos_2.PerformerDto(user).toResponse() });
        });
        return {
            data: messages.map((m) => new dtos_3.MessageDto(m)),
            total
        };
    }
    async createStreamMessageFromConversation(conversationId, payload, sender, user) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        const dto = new dtos_3.MessageDto(message);
        dto.senderInfo = user;
        await this.queueEventService.publish({
            channel: constants_2.MESSAGE_PRIVATE_STREAM_CHANNEL,
            eventName: constants_2.MESSAGE_EVENT.CREATED,
            data: { message: dto, conversation }
        });
        return dto;
    }
    async deleteAllMessageInConversation(conversationId, user) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (conversation.performerId.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        await this.messageModel.deleteMany({ conversationId: conversation._id });
        return { success: true };
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => conversation_service_1.ConversationService))),
    __param(3, (0, common_1.Inject)(message_provider_1.MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_3.UserService,
        conversation_service_1.ConversationService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map