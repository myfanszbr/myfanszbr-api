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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const stream_service_1 = require("../services/stream.service");
const payloads_1 = require("../payloads");
let StreamController = class StreamController {
    constructor(streamService) {
        this.streamService = streamService;
    }
    async getList(req) {
        const data = await this.streamService.adminSearch(req);
        return kernel_1.DataResponse.ok(data);
    }
    async userList(req, user) {
        const data = await this.streamService.userSearch(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async endSession(id) {
        const data = await this.streamService.endSessionStream(id);
        return kernel_1.DataResponse.ok(data);
    }
    async goLive(performer, payload) {
        const data = await this.streamService.goLive(payload, performer);
        return kernel_1.DataResponse.ok(data);
    }
    async editLive(id, payload) {
        const data = await this.streamService.editLive(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async join(performerId, user) {
        const data = await this.streamService.joinPublicChat(performerId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async setDuration(user, payload) {
        const result = await this.streamService.updateStreamDuration(payload, user);
        return kernel_1.DataResponse.ok(result);
    }
};
__decorate([
    (0, common_1.Get)('/admin/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SearchStreamPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('/user/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SearchStreamPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "userList", null);
__decorate([
    (0, common_1.Post)('/admin/end-session/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "endSession", null);
__decorate([
    (0, common_1.Post)('/live'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto,
        payloads_1.StartStreamPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "goLive", null);
__decorate([
    (0, common_1.Put)('/live/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.UpdateStreamPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "editLive", null);
__decorate([
    (0, common_1.Get)('/join/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "join", null);
__decorate([
    (0, common_1.Put)('/set-duration'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto,
        payloads_1.SetDurationPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "setDuration", null);
StreamController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('streaming'),
    __metadata("design:paramtypes", [stream_service_1.StreamService])
], StreamController);
exports.StreamController = StreamController;
//# sourceMappingURL=stream.controller.js.map