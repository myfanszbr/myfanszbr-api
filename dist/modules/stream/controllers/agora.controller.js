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
exports.AgoraController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const guards_1 = require("../../auth/guards");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
let AgoraController = class AgoraController {
    constructor(aograService) {
        this.aograService = aograService;
    }
    buildTokenWithAccount(payload, currentUser) {
        return kernel_1.DataResponse.ok(this.aograService.buildTokenWithAccount(payload.channelName, currentUser._id.toString()));
    }
};
__decorate([
    (0, common_1.Post)('/token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.UserDto]),
    __metadata("design:returntype", void 0)
], AgoraController.prototype, "buildTokenWithAccount", null);
AgoraController = __decorate([
    (0, common_1.Controller)('streaming/agora'),
    __metadata("design:paramtypes", [services_1.AgoraService])
], AgoraController);
exports.AgoraController = AgoraController;
//# sourceMappingURL=agora.controller.js.map