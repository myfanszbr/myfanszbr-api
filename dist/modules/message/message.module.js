"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const performer_module_1 = require("../performer/performer.module");
const subscription_module_1 = require("../subscription/subscription.module");
const providers_1 = require("./providers");
const socket_module_1 = require("../socket/socket.module");
const listeners_1 = require("./listeners");
const services_1 = require("./services");
const conversation_controller_1 = require("./controllers/conversation.controller");
const message_controller_1 = require("./controllers/message.controller");
const block_module_1 = require("../block/block.module");
const utils_module_1 = require("../utils/utils.module");
const stream_module_1 = require("../stream/stream.module");
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            socket_module_1.SocketModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => utils_module_1.UtilsModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => block_module_1.BlockModule),
            (0, common_1.forwardRef)(() => stream_module_1.StreamModule)
        ],
        providers: [
            ...providers_1.messageProviders,
            ...providers_1.conversationProviders,
            ...providers_1.notificationMessageProviders,
            services_1.ConversationService,
            services_1.MessageService,
            services_1.NotificationMessageService,
            listeners_1.MessageListener,
            listeners_1.DeleteUserMessageListener,
            listeners_1.NewSubscriptionListener
        ],
        controllers: [conversation_controller_1.ConversationController, message_controller_1.MessageController],
        exports: [services_1.ConversationService, services_1.MessageService]
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map