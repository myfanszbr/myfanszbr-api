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
exports.MessageListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_1 = require("../../stream/services");
const services_2 = require("../../file/services");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
const MESSAGE_NOTIFY = 'MESSAGE_NOTIFY';
const MESSAGE_STREAM_NOTIFY = 'MESSAGE_STREAM_NOTIFY';
const DELETE_MESSAGE_TOPIC = 'DELETE_MESSAGE_TOPIC';
let MessageListener = class MessageListener {
    constructor(streamService, fileService, conversationModel, NotificationModel, messageModel, queueEventService, socketUserService) {
        this.streamService = streamService;
        this.fileService = fileService;
        this.conversationModel = conversationModel;
        this.NotificationModel = NotificationModel;
        this.messageModel = messageModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.queueEventService.subscribe(constants_1.MESSAGE_CHANNEL, MESSAGE_NOTIFY, this.handleMessage.bind(this));
        this.queueEventService.subscribe(constants_1.MESSAGE_PRIVATE_STREAM_CHANNEL, MESSAGE_STREAM_NOTIFY, this.handleStreamMessage.bind(this));
        this.queueEventService.subscribe(constants_1.DELETE_MESSAGE_CHANNEL, DELETE_MESSAGE_TOPIC, this.handleDeleteMessage.bind(this));
    }
    async handleMessage(event) {
        if (![constants_1.MESSAGE_EVENT.CREATED, constants_1.MESSAGE_EVENT.DELETED].includes(event.eventName))
            return;
        const message = event.data;
        const conversation = await this.conversationModel
            .findOne({ _id: message.conversationId })
            .lean()
            .exec();
        if (!conversation)
            return;
        const recipient = conversation.recipients.find((r) => r.sourceId.toString() !== message.senderId.toString());
        if (event.eventName === constants_1.MESSAGE_EVENT.CREATED) {
            await this.updateNotification(conversation, recipient);
            await this.handleSent(recipient.sourceId, message);
            await this.updateLastMessage(conversation, message);
        }
        else if (event.eventName === constants_1.MESSAGE_EVENT.DELETED) {
            const lastMessage = await this.messageModel
                .findOne({ conversationId: conversation._id })
                .sort({ createdAt: -1 })
                .lean();
            await this.handleDelete(recipient.sourceId, message);
            await this.updateLastMessage(conversation, lastMessage);
        }
    }
    async updateLastMessage(conversation, message) {
        const lastMessage = kernel_1.StringHelper.truncate(message.text || '', 30);
        const lastSenderId = message.senderId;
        const lastMessageCreatedAt = message.createdAt;
        await this.conversationModel.updateOne({ _id: conversation._id }, {
            $set: {
                lastMessage,
                lastSenderId,
                lastMessageCreatedAt
            }
        });
    }
    async handleDeleteMessage(event) {
        if (event.eventName !== constants_1.MESSAGE_EVENT.DELETED)
            return;
        const { messageId } = event.data;
        const message = await this.messageModel.findById(messageId);
        if (!message)
            throw new kernel_1.EntityNotFoundException();
        await Promise.all([
            this.messageModel.deleteOne({ _id: message._id }),
            message.fileIds && message.fileIds.length > 0 && this.fileService.removeMany(message.fileIds)
        ]);
    }
    async updateNotification(conversation, recipient) {
        let notification = await this.NotificationModel.findOne({
            recipientId: recipient.sourceId,
            conversationId: conversation._id
        });
        if (!notification) {
            notification = new this.NotificationModel({
                recipientId: recipient.sourceId,
                conversationId: conversation._id,
                totalNotReadMessage: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        notification.totalNotReadMessage += 1;
        await notification.save();
        const totalNotReadMessage = await this.NotificationModel.aggregate([
            {
                $match: { recipientId: recipient.sourceId }
            },
            {
                $group: {
                    _id: '$conversationId',
                    total: {
                        $sum: '$totalNotReadMessage'
                    }
                }
            }
        ]);
        let total = 0;
        totalNotReadMessage && totalNotReadMessage.length && totalNotReadMessage.forEach((data) => {
            if (data.total) {
                total += 1;
            }
        });
        await this.notifyCountingNotReadMessageInConversation(recipient.sourceId, total);
    }
    async notifyCountingNotReadMessageInConversation(receiverId, total) {
        await this.socketUserService.emitToUsers(receiverId, 'nofify_read_messages_in_conversation', { total });
    }
    async handleSent(recipientId, message) {
        await this.socketUserService.emitToUsers(recipientId, 'message_created', message);
    }
    async handleDelete(recipientId, message) {
        await this.socketUserService.emitToUsers(recipientId, 'message_deleted', message);
    }
    async handleStreamMessage(event) {
        if (![constants_1.MESSAGE_EVENT.CREATED, constants_1.MESSAGE_EVENT.DELETED].includes(event.eventName))
            return;
        const { message, conversation } = event.data;
        const roomName = this.streamService.getRoomName(conversation._id, conversation.type);
        await this.socketUserService.emitToRoom(roomName, `message_${event.eventName}_conversation_${conversation._id}`, message);
    }
};
MessageListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.StreamService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.FileService))),
    __param(2, (0, common_1.Inject)(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_1.MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.StreamService,
        services_2.FileService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService])
], MessageListener);
exports.MessageListener = MessageListener;
//# sourceMappingURL=message.listener.js.map