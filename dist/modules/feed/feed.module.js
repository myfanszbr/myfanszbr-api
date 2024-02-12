"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const subscription_module_1 = require("../subscription/subscription.module");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const listeners_1 = require("./listeners");
const file_module_1 = require("../file/file.module");
const performer_module_1 = require("../performer/performer.module");
const reaction_module_1 = require("../reaction/reaction.module");
const token_transaction_module_1 = require("../token-transaction/token-transaction.module");
const follow_module_1 = require("../follow/follow.module");
const jobs_1 = require("./jobs");
const mailer_module_1 = require("../mailer/mailer.module");
const user_module_1 = require("../user/user.module");
const block_module_1 = require("../block/block.module");
const comment_module_1 = require("../comment/comment.module");
let FeedModule = class FeedModule {
};
FeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            kernel_1.AgendaModule.register(),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => reaction_module_1.ReactionModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => token_transaction_module_1.TokenTransactionModule),
            (0, common_1.forwardRef)(() => follow_module_1.FollowModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => block_module_1.BlockModule),
            (0, common_1.forwardRef)(() => comment_module_1.CommentModule)
        ],
        providers: [
            ...providers_1.feedProviders,
            ...providers_1.pollProviders,
            ...providers_1.voteProviders,
            ...providers_1.scheduledStreamNotificationProviders,
            services_1.FeedService, services_1.FeedFileService,
            listeners_1.ReactionFeedListener,
            listeners_1.CommentFeedListener,
            listeners_1.PollFeedListener,
            listeners_1.DeletePerformerFeedListener,
            jobs_1.ScheduledFeedAgendaJob,
            jobs_1.ScheduledStreamNofificationAgendaJob
        ],
        controllers: [
            controllers_1.AdminFeedController,
            controllers_1.PerformerFeedController,
            controllers_1.UserFeedController
        ],
        exports: [
            ...providers_1.feedProviders,
            services_1.FeedService
        ]
    })
], FeedModule);
exports.FeedModule = FeedModule;
//# sourceMappingURL=feed.module.js.map