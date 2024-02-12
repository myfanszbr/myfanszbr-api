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
exports.FollowController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const follow_service_1 = require("../services/follow.service");
const payloads_1 = require("../payloads");
let FollowController = class FollowController {
    constructor(followService) {
        this.followService = followService;
    }
    async create(user, id) {
        const data = await this.followService.create(id, user);
        return kernel_1.DataResponse.ok(data);
    }
    async remove(user, id) {
        const data = await this.followService.remove(id, user);
        return kernel_1.DataResponse.ok(data);
    }
    async followers(req, user) {
        req.followingId = user._id.toString();
        const data = await this.followService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async following(req, user) {
        req.followerId = user._id.toString();
        const data = await this.followService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)('/:followingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('followingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('/:followingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('followingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/followers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.FollowSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "followers", null);
__decorate([
    (0, common_1.Get)('/following'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.FollowSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "following", null);
FollowController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('follows'),
    __metadata("design:paramtypes", [follow_service_1.FollowService])
], FollowController);
exports.FollowController = FollowController;
//# sourceMappingURL=follow.controller.js.map