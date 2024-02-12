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
exports.PerformerEarningController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const earning_service_1 = require("../services/earning.service");
const payloads_1 = require("../payloads");
let PerformerEarningController = class PerformerEarningController {
    constructor(earningService) {
        this.earningService = earningService;
    }
    async search(req, user) {
        const data = await this.earningService.search(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async performerStats(req, user) {
        req.performerId = user._id;
        const data = await this.earningService.stats(req);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerEarningController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/stats'),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerEarningController.prototype, "performerStats", null);
PerformerEarningController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer/earning'),
    __metadata("design:paramtypes", [earning_service_1.EarningService])
], PerformerEarningController);
exports.PerformerEarningController = PerformerEarningController;
//# sourceMappingURL=performer-earning.controller.js.map