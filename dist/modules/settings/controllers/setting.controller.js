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
exports.SettingController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
let SettingController = class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async getPublicSettings() {
        const data = await this.settingService.getAutoloadPublicSettingsForUser();
        return kernel_1.DataResponse.ok(data);
    }
    async getPublicValueByKey(key) {
        const data = await this.settingService.getPublicValueByKey(key);
        return kernel_1.DataResponse.ok(data);
    }
    async getPublicValueByKeys(keys) {
        if (!Array.isArray(keys))
            return null;
        const data = await this.settingService.getPublicValueByKeys(keys);
        return kernel_1.DataResponse.ok(data);
    }
    async getPublicSettingByKey(key) {
        const data = services_1.SettingService.getByKey(key);
        if (!data.public || !data.visible) {
            throw new common_1.HttpException('Error', 404);
        }
        return kernel_1.DataResponse.ok({
            value: data.value
        });
    }
};
__decorate([
    (0, common_1.Get)('/public'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPublicSettings", null);
__decorate([
    (0, common_1.Get)('/keys/:key'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPublicValueByKey", null);
__decorate([
    (0, common_1.Post)('/keys'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)('keys')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPublicValueByKeys", null);
__decorate([
    (0, common_1.Get)('/public/:key'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPublicSettingByKey", null);
SettingController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [services_1.SettingService])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map