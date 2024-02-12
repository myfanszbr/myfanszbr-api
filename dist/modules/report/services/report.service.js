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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../performer/dtos");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const mailer_1 = require("../../mailer");
const services_1 = require("../../feed/services");
const providers_1 = require("../providers");
const dtos_2 = require("../../user/dtos");
const report_dto_1 = require("../dtos/report.dto");
const services_2 = require("../../user/services");
const services_3 = require("../../performer/services");
let ReportService = class ReportService {
    constructor(feedService, performerService, userService, reportModel, mailService) {
        this.feedService = feedService;
        this.performerService = performerService;
        this.userService = userService;
        this.reportModel = reportModel;
        this.mailService = mailService;
    }
    async create(payload, user) {
        const existReport = await this.reportModel.findOne({
            target: payload.target,
            targetId: payload.targetId,
            sourceId: user._id
        });
        if (existReport) {
            existReport.description = payload.description;
            await existReport.save();
            return new report_dto_1.ReportDto(existReport);
        }
        const data = Object.assign({}, payload);
        data.sourceId = user._id;
        data.source = user.isPerformer ? 'performer' : 'user';
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const newreport = await this.reportModel.create(data);
        const adminEmail = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.ADMIN_EMAIL);
        const feed = await this.feedService.findById(newreport.targetId);
        const performer = feed && await this.performerService.findById(feed.fromSourceId);
        await Promise.all([
            adminEmail && this.mailService.send({
                subject: 'New reportion',
                to: adminEmail,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    link: `${process.env.USER_URL}/post/${newreport.targetId}`,
                    title: newreport.title,
                    description: newreport.description
                },
                template: 'admin-report'
            }),
            (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailService.send({
                subject: 'New reportion',
                to: performer === null || performer === void 0 ? void 0 : performer.email,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    link: `${process.env.USER_URL}/post/${newreport.targetId}`,
                    title: newreport.title,
                    description: newreport.description
                },
                template: 'performer-report'
            })
        ]);
        return new report_dto_1.ReportDto(newreport);
    }
    async remove(id) {
        const report = await this.reportModel.findById(id);
        if (!report) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.reportModel.deleteOne({ _id: report._id });
        return { deleted: true };
    }
    async search(req) {
        const query = {};
        if (req.sourceId) {
            query.sourceId = req.sourceId;
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.targetId) {
            query.targetId = req.targetId;
        }
        if (req.target) {
            query.target = req.target;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.reportModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reportModel.countDocuments(query)
        ]);
        const reports = data.map((d) => new report_dto_1.ReportDto(d));
        const userIds = data.map((d) => d.sourceId);
        const performerIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            userIds.length ? this.userService.findByIds(userIds) : [],
            performerIds.length ? this.performerService.findByIds(performerIds.concat(userIds)) : []
        ]);
        reports.forEach((report) => {
            const user = users.find((u) => `${u === null || u === void 0 ? void 0 : u._id}` === `${report === null || report === void 0 ? void 0 : report.sourceId}`) || performers.find((p) => `${p === null || p === void 0 ? void 0 : p._id}` === `${report === null || report === void 0 ? void 0 : report.sourceId}`);
            const performer = performers.find((p) => `${p === null || p === void 0 ? void 0 : p._id}` === `${report === null || report === void 0 ? void 0 : report.performerId}`);
            report.sourceInfo = (user && new dtos_2.UserDto(user)) || null;
            report.performerInfo = (performer && new dtos_1.PerformerDto(performer)) || null;
        });
        return {
            data: reports,
            total
        };
    }
};
ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.FeedService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(3, (0, common_1.Inject)(providers_1.REPORT_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => mailer_1.MailerService))),
    __metadata("design:paramtypes", [services_1.FeedService,
        services_3.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        mailer_1.MailerService])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map