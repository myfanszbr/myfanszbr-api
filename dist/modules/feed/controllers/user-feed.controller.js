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
exports.UserFeedController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../services");
const payloads_1 = require("../payloads");
let UserFeedController = class UserFeedController {
    constructor(feedService, authService) {
        this.feedService = feedService;
        this.authService = authService;
    }
    async getPerformerFeeds(query, user, req) {
        const data = await this.feedService.userSearchFeeds(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id, user, req) {
        const data = await this.feedService.findOne(id, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async checkAuth(req) {
        if (!req.query.token)
            throw new kernel_1.ForbiddenException();
        const auth = await this.authService.verifySession(req.query.token);
        if (!auth)
            throw new kernel_1.ForbiddenException();
        const user = await this.authService.getSourceFromAuthSession({ source: auth.source, sourceId: auth.sourceId });
        if (!user) {
            throw new kernel_1.ForbiddenException();
        }
        const valid = await this.feedService.checkAuth(req, user);
        return kernel_1.DataResponse.ok(valid);
    }
    async create(pollId, user) {
        const data = await this.feedService.votePollFeed(pollId, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.FeedSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserFeedController.prototype, "getPerformerFeeds", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserFeedController.prototype, "details", null);
__decorate([
    (0, common_1.Get)('/auth/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserFeedController.prototype, "checkAuth", null);
__decorate([
    (0, common_1.Post)('/vote/:pollId'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('pollId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserFeedController.prototype, "create", null);
UserFeedController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('user/feeds'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_2.FeedService,
        services_1.AuthService])
], UserFeedController);
exports.UserFeedController = UserFeedController;
//# sourceMappingURL=user-feed.controller.js.map