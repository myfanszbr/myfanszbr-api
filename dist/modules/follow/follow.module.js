"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const follow_controller_1 = require("./controllers/follow.controller");
const follow_service_1 = require("./services/follow.service");
const providers_1 = require("./providers");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const user_delete_listener_1 = require("./listeners/user-delete.listener");
const user_module_1 = require("../user/user.module");
const mailer_module_1 = require("../mailer/mailer.module");
let FollowModule = class FollowModule {
};
FollowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...providers_1.followProviders,
            follow_service_1.FollowService,
            user_delete_listener_1.DeletePerformerFollowListener
        ],
        controllers: [follow_controller_1.FollowController],
        exports: [follow_service_1.FollowService]
    })
], FollowModule);
exports.FollowModule = FollowModule;
//# sourceMappingURL=follow.module.js.map