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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const country_service_1 = require("../services/country.service");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    list() {
        return kernel_1.DataResponse.ok(this.countryService.getList());
    }
};
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "list", null);
CountryController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
exports.CountryController = CountryController;
//# sourceMappingURL=countries.controller.js.map