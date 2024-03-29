"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const mailer_module_1 = require("../mailer/mailer.module");
const utils_module_1 = require("../utils/utils.module");
let BlockModule = class BlockModule {
};
BlockModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.AgendaModule.register(),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => utils_module_1.UtilsModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...providers_1.blockProviders,
            services_1.PerformerBlockService,
            services_1.BlockService
        ],
        controllers: [
            controllers_1.BlockController,
            controllers_1.PerformerBlockController,
            controllers_1.AdminBlockController
        ],
        exports: [
            ...providers_1.blockProviders,
            services_1.PerformerBlockService,
            services_1.BlockService
        ]
    })
], BlockModule);
exports.BlockModule = BlockModule;
//# sourceMappingURL=block.module.js.map