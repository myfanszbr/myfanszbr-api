"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const feed_module_1 = require("../feed/feed.module");
const reaction_controller_1 = require("./controllers/reaction.controller");
const reaction_service_1 = require("./services/reaction.service");
const reaction_provider_1 = require("./providers/reaction.provider");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const listeners_1 = require("./listeners");
const file_module_1 = require("../file/file.module");
const follow_module_1 = require("../follow/follow.module");
let ReactionModule = class ReactionModule {
};
ReactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => feed_module_1.FeedModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => follow_module_1.FollowModule)
        ],
        providers: [...reaction_provider_1.reactionProviders, reaction_service_1.ReactionService, listeners_1.DeletePerformerReactionListener, listeners_1.DeleteAssetsListener],
        controllers: [reaction_controller_1.ReactionController],
        exports: [reaction_service_1.ReactionService]
    })
], ReactionModule);
exports.ReactionModule = ReactionModule;
//# sourceMappingURL=reaction.module.js.map