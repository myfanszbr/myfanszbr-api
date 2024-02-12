"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const utils_module_1 = require("../utils/utils.module");
const auth_module_1 = require("../auth/auth.module");
const subscription_module_1 = require("../subscription/subscription.module");
const setting_module_1 = require("../settings/setting.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const reaction_module_1 = require("../reaction/reaction.module");
const mailer_module_1 = require("../mailer/mailer.module");
const block_module_1 = require("../block/block.module");
const listeners_1 = require("./listeners");
const follow_module_1 = require("../follow/follow.module");
let PerformerModule = class PerformerModule {
};
PerformerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.AgendaModule.register(),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => utils_module_1.UtilsModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => reaction_module_1.ReactionModule),
            (0, common_1.forwardRef)(() => block_module_1.BlockModule),
            (0, common_1.forwardRef)(() => follow_module_1.FollowModule)
        ],
        providers: [
            ...providers_1.performerProviders,
            services_1.CategoryService,
            services_1.CategorySearchService,
            services_1.PerformerService,
            services_1.PerformerSearchService,
            listeners_1.PerformerAssetsListener,
            listeners_1.PerformerConnectedListener,
            listeners_1.UpdatePerformerStatusListener
        ],
        controllers: [
            controllers_1.CategoryController,
            controllers_1.AdminCategoryController,
            controllers_1.AdminPerformerController,
            controllers_1.PerformerController
        ],
        exports: [
            ...providers_1.performerProviders,
            services_1.PerformerService,
            services_1.CategoryService,
            services_1.PerformerSearchService
        ]
    })
], PerformerModule);
exports.PerformerModule = PerformerModule;
//# sourceMappingURL=performer.module.js.map