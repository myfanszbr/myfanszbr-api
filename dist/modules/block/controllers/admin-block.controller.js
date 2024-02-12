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
exports.AdminBlockController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../services");
const site_block_country_payload_1 = require("../payloads/site-block-country.payload");
let AdminBlockController = class AdminBlockController {
    constructor(blockService) {
        this.blockService = blockService;
    }
    async search() {
        const search = await this.blockService.search();
        return kernel_1.DataResponse.ok(search);
    }
    async createUser(payload) {
        const resp = await this.blockService.create(payload);
        return kernel_1.DataResponse.ok(resp);
    }
    async delete(countryCode) {
        const deleted = await this.blockService.delete(countryCode);
        return kernel_1.DataResponse.ok(deleted);
    }
};
__decorate([
    (0, common_1.Get)('/countries'),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminBlockController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('/countries'),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_block_country_payload_1.BlockCountryCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminBlockController.prototype, "createUser", null);
__decorate([
    (0, common_1.Delete)('/countries/:code'),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBlockController.prototype, "delete", null);
AdminBlockController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/block'),
    __metadata("design:paramtypes", [services_1.BlockService])
], AdminBlockController);
exports.AdminBlockController = AdminBlockController;
//# sourceMappingURL=admin-block.controller.js.map