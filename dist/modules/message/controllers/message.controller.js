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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const file_1 = require("../../file");
const contants_1 = require("../../storage/contants");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let MessageController = class MessageController {
    constructor(messageService, notificationMessageService) {
        this.messageService = messageService;
        this.notificationMessageService = notificationMessageService;
    }
    async validatePublicPhoto(file) {
        await this.messageService.validatePhotoFile(file, true);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file.toResponse()), { url: file.getUrl() }));
    }
    async createVideoFileMessage(file) {
        await this.messageService.validateVideoFile(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file.toResponse()), { url: file.getUrl() }));
    }
    async readAllMessage(conversationId, user) {
        const message = await this.notificationMessageService.recipientReadAllMessageInConversation(user, conversationId);
        return kernel_1.DataResponse.ok(message);
    }
    async countTotalNotReadMessage(user) {
        const data = await this.notificationMessageService.countTotalNotReadMessage(user._id);
        return kernel_1.DataResponse.ok(data);
    }
    async loadMessages(query, conversationId, user, req) {
        query.conversationId = conversationId;
        const data = await this.messageService.loadPrivateMessages(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async createMessage(payload, conversationId, req) {
        const data = await this.messageService.createPrivateMessage(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async createStreamMessage(payload, conversationId, req, user) {
        const data = await this.messageService.createStreamMessageFromConversation(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, user);
        return kernel_1.DataResponse.ok(data);
    }
    async deleteMessage(messageId, user) {
        const data = await this.messageService.deleteMessage(messageId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async deleteAllPublicMessage(conversationId, user) {
        const data = await this.messageService.deleteAllMessageInConversation(conversationId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async loadPublicMessages(req, conversationId) {
        req.conversationId = conversationId;
        const data = await this.messageService.loadPublicMessages(req);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)('/public/file/photo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('message-photo', 'file', {
        destination: (0, kernel_1.getConfig)('file').messageDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "validatePublicPhoto", null);
__decorate([
    (0, common_1.Post)('/private/file/video'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('message-video', 'file', {
        destination: (0, kernel_1.getConfig)('file').messageDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createVideoFileMessage", null);
__decorate([
    (0, common_1.Post)('/read-all/:conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "readAllMessage", null);
__decorate([
    (0, common_1.Get)('/counting-not-read-messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "countTotalNotReadMessage", null);
__decorate([
    (0, common_1.Get)('/conversations/:conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, auth_1.CurrentUser)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageListRequest, String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "loadMessages", null);
__decorate([
    (0, common_1.Post)('/conversations/:conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Post)('/stream/conversations/:conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createStreamMessage", null);
__decorate([
    (0, common_1.Delete)('/:messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Delete)('/:conversationId/remove-all-message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin', 'performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteAllPublicMessage", null);
__decorate([
    (0, common_1.Get)('/conversations/public/:conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageListRequest, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "loadPublicMessages", null);
MessageController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [services_1.MessageService,
        services_1.NotificationMessageService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map