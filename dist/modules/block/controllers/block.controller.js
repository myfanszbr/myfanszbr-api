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
exports.BlockController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../utils/services");
const services_2 = require("../services");
let BlockController = class BlockController {
    constructor(blockService, countryService) {
        this.blockService = blockService;
        this.countryService = countryService;
    }
    async blockCountry(req) {
        let ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipAddress = ipAddress.split(',')[0];
        let userCountry = null;
        const countryCode = req.headers['cf-ipcountry'] || null;
        if (countryCode) {
            const check = await this.blockService.checkCountryBlock(countryCode);
            return kernel_1.DataResponse.ok(check);
        }
        if (!ipAddress.includes('127.0.0.1') && !countryCode) {
            try {
                userCountry = await this.countryService.findCountryByIP(ipAddress);
                if (userCountry && userCountry.status === 'success' && userCountry.countryCode) {
                    const check = await this.blockService.checkCountryBlock(userCountry.countryCode);
                    return kernel_1.DataResponse.ok(check);
                }
            }
            catch (e) {
                return kernel_1.DataResponse.ok({ blocked: false });
            }
        }
        return kernel_1.DataResponse.ok({ blocked: false });
    }
};
__decorate([
    (0, common_1.Get)('/countries/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "blockCountry", null);
BlockController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('block'),
    __metadata("design:paramtypes", [services_2.BlockService,
        services_1.CountryService])
], BlockController);
exports.BlockController = BlockController;
//# sourceMappingURL=block.controller.js.map