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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatisticController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const auth_1 = require("../../auth");
const statistic_service_1 = require("../services/statistic.service");
let AdminStatisticController = class AdminStatisticController {
    constructor(statisticService) {
        this.statisticService = statisticService;
    }
    async list() {
        const stats = await this.statisticService.stats();
        return kernel_1.DataResponse.ok(stats);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatisticController.prototype, "list", null);
AdminStatisticController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/statistics'),
    __metadata("design:paramtypes", [statistic_service_1.StatisticService])
], AdminStatisticController);
exports.AdminStatisticController = AdminStatisticController;
//# sourceMappingURL=admin-statistics.controller.js.map