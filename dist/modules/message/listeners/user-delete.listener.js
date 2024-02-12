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
exports.DeleteUserMessageListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../user/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../file/services");
const constants_3 = require("../../performer/constants");
const providers_1 = require("../providers");
const constants_4 = require("../constants");
const DELETE_USER_MESSAGE_TOPIC = 'DELETE_USER_MESSAGE_TOPIC';
const DELETE_PERFORMER_MESSAGE_TOPIC = 'DELETE_PERFORMER_MESSAGE_TOPIC';
let DeleteUserMessageListener = class DeleteUserMessageListener {
    constructor(fileService, queueEventService, messageModel, conversationModel, notificationMessageModel) {
        this.fileService = fileService;
        this.queueEventService = queueEventService;
        this.messageModel = messageModel;
        this.conversationModel = conversationModel;
        this.notificationMessageModel = notificationMessageModel;
        this.queueEventService.subscribe(constants_1.DELETE_USER_CHANNEL, DELETE_USER_MESSAGE_TOPIC, this.handleDeleteData.bind(this));
        this.queueEventService.subscribe(constants_3.DELETE_PERFORMER_CHANNEL, DELETE_PERFORMER_MESSAGE_TOPIC, this.handleDeleteData.bind(this));
    }
    async handleDeleteData(event) {
        if (event.eventName !== constants_2.EVENT.DELETED)
            return;
        const user = event.data;
        const conversations = await this.conversationModel.find({
            recipients: {
                $elemMatch: {
                    sourceId: user._id
                }
            },
            type: constants_4.CONVERSATION_TYPE.PRIVATE
        });
        const conversationIds = conversations.map((c) => c._id);
        const messages = await this.messageModel.find({
            senderId: user._id,
            type: 'photo'
        });
        const messageIds = messages.map((c) => c._id);
        await Promise.all([
            this.notificationMessageModel.deleteMany({
                recipientId: user._id
            }),
            this.conversationModel.deleteMany({
                _id: conversationIds
            }),
            this.messageModel.deleteMany({
                senderId: user._id
            }),
            this.fileService.deleteManyByRefIds(messageIds)
        ]);
    }
};
DeleteUserMessageListener = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(providers_1.MESSAGE_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.FileService,
        kernel_1.QueueEventService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], DeleteUserMessageListener);
exports.DeleteUserMessageListener = DeleteUserMessageListener;
//# sourceMappingURL=user-delete.listener.js.map