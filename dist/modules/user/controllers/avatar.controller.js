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
exports.AvatarController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const auth_1 = require("../../auth");
const contants_1 = require("../../storage/contants");
const dtos_1 = require("../dtos");
const services_1 = require("../services");
let AvatarController = class AvatarController {
    constructor(userService) {
        this.userService = userService;
    }
    async uploadAvatar(user, file) {
        await this.userService.updateAvatar(user, file);
        return kernel_1.DataResponse.ok({
            success: true,
            url: file.getUrl()
        });
    }
};
__decorate([
    (0, common_1.Post)('/avatar/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('avatar', 'avatar', {
        destination: (0, kernel_1.getConfig)('file').avatarDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "uploadAvatar", null);
AvatarController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [services_1.UserService])
], AvatarController);
exports.AvatarController = AvatarController;
//# sourceMappingURL=avatar.controller.js.map