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
exports.StateController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const state_service_1 = require("../services/state.service");
let StateController = class StateController {
    constructor(stateService) {
        this.stateService = stateService;
    }
    list(code) {
        return kernel_1.DataResponse.ok(this.stateService.getStatesByCountry(code));
    }
};
__decorate([
    (0, common_1.Get)(':countryCode'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('countryCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StateController.prototype, "list", null);
StateController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('states'),
    __metadata("design:paramtypes", [state_service_1.StateService])
], StateController);
exports.StateController = StateController;
//# sourceMappingURL=states.controller.js.map