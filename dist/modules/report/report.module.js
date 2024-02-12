"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const report_controller_1 = require("./controllers/report.controller");
const report_service_1 = require("./services/report.service");
const providers_1 = require("./providers");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const listeners_1 = require("./listeners");
const mailer_module_1 = require("../mailer/mailer.module");
const setting_module_1 = require("../settings/setting.module");
const feed_module_1 = require("../feed/feed.module");
let ReportModule = class ReportModule {
};
ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => feed_module_1.FeedModule)
        ],
        providers: [
            ...providers_1.reportProviders,
            listeners_1.DeleteAssetsListener,
            listeners_1.DeleteUserReactionListener,
            report_service_1.ReportService
        ],
        controllers: [report_controller_1.ReportController],
        exports: [report_service_1.ReportService]
    })
], ReportModule);
exports.ReportModule = ReportModule;
//# sourceMappingURL=report.module.js.map