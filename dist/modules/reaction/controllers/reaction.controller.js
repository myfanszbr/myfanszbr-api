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
exports.ReactionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const reaction_service_1 = require("../services/reaction.service");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
let ReactionController = class ReactionController {
    constructor(authService, reactionService) {
        this.authService = authService;
        this.reactionService = reactionService;
    }
    async create(user, payload) {
        const data = await this.reactionService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async remove(user, payload) {
        const data = await this.reactionService.remove(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async bookmarkFeeds(query, user, req) {
        const data = await this.reactionService.getListFeeds(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async bookmarkProducts(query, user) {
        const data = await this.reactionService.getListProduct(query, user);
        return kernel_1.DataResponse.ok(data);
    }
    async bookmarkVideo(query, user) {
        const data = await this.reactionService.getListVideo(query, user);
        return kernel_1.DataResponse.ok(data);
    }
    async bookmarkGalleries(query, user, req) {
        const data = await this.reactionService.getListGallery(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async bookmarkPerformers(req, user) {
        const data = await this.reactionService.getListPerformer(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.ReactionCreatePayload]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.ReactionCreatePayload]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/feeds/bookmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "bookmarkFeeds", null);
__decorate([
    (0, common_1.Get)('/products/bookmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "bookmarkProducts", null);
__decorate([
    (0, common_1.Get)('/videos/bookmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "bookmarkVideo", null);
__decorate([
    (0, common_1.Get)('/galleries/bookmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "bookmarkGalleries", null);
__decorate([
    (0, common_1.Get)('/performers/bookmark'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "bookmarkPerformers", null);
ReactionController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('reactions'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        reaction_service_1.ReactionService])
], ReactionController);
exports.ReactionController = ReactionController;
//# sourceMappingURL=reaction.controller.js.map