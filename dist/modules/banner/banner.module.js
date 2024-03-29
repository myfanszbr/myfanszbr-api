"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const services_1 = require("./services");
const admin_banner_controller_1 = require("./controllers/admin-banner.controller");
const banner_controller_1 = require("./controllers/banner.controller");
let BannerModule = class BannerModule {
};
BannerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule)
        ],
        providers: [...providers_1.bannerProviders, services_1.BannerService, services_1.BannerSearchService],
        controllers: [admin_banner_controller_1.AdminBannerController, banner_controller_1.BannerController],
        exports: [services_1.BannerService, services_1.BannerSearchService]
    })
], BannerModule);
exports.BannerModule = BannerModule;
//# sourceMappingURL=banner.module.js.map