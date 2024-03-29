"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const reaction_module_1 = require("../reaction/reaction.module");
const comment_controller_1 = require("./controllers/comment.controller");
const comment_service_1 = require("./services/comment.service");
const comment_provider_1 = require("./providers/comment.provider");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const listeners_1 = require("./listeners");
const feed_module_1 = require("../feed/feed.module");
const mailer_module_1 = require("../mailer/mailer.module");
let CommentModule = class CommentModule {
};
CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => reaction_module_1.ReactionModule),
            (0, common_1.forwardRef)(() => feed_module_1.FeedModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...comment_provider_1.commentProviders,
            comment_service_1.CommentService,
            listeners_1.ReplyCommentListener,
            listeners_1.ReactionCommentListener,
            listeners_1.DeleteUserListener
        ],
        controllers: [
            comment_controller_1.CommentController
        ],
        exports: [comment_service_1.CommentService]
    })
], CommentModule);
exports.CommentModule = CommentModule;
//# sourceMappingURL=comment.module.js.map