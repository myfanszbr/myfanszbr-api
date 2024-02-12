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
exports.PayoutRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../performer/dtos");
const services_1 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const earning_provider_1 = require("../../earning/providers/earning.provider");
const constants_2 = require("../constants");
const exceptions_1 = require("../exceptions");
const payout_request_dto_1 = require("../dtos/payout-request.dto");
const payout_request_provider_1 = require("../providers/payout-request.provider");
let PayoutRequestService = class PayoutRequestService {
    constructor(earningModel, payoutRequestModel, queueEventService, performerService, mailService, settingService) {
        this.earningModel = earningModel;
        this.payoutRequestModel = payoutRequestModel;
        this.queueEventService = queueEventService;
        this.performerService = performerService;
        this.mailService = mailService;
        this.settingService = settingService;
    }
    async search(req, user) {
        var _a;
        const query = {};
        if (req.sourceId) {
            query.sourceId = (0, string_helper_1.toObjectId)(req.sourceId);
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.status) {
            query.status = req.status;
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const [data, total] = await Promise.all([
            this.payoutRequestModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.payoutRequestModel.countDocuments(query)
        ]);
        const requests = data.map((d) => new payout_request_dto_1.PayoutRequestDto(d));
        if ((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) {
            const sourceIds = (0, lodash_1.uniq)(requests.map((r) => r.sourceId));
            const sources = await this.performerService.findByIds(sourceIds);
            requests.forEach((request) => {
                const sourceInfo = sources.find((s) => s && s._id.toString() === request.sourceId.toString());
                request.sourceInfo = sourceInfo && new dtos_1.PerformerDto(sourceInfo).toResponse();
            });
        }
        return {
            total,
            data: requests
        };
    }
    async findById(id) {
        const request = await this.payoutRequestModel.findById(id);
        return request;
    }
    async performerCreate(payload, user) {
        var _a;
        const minimumPayoutAmount = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT) || 50;
        if (payload.requestTokens < minimumPayoutAmount) {
            throw new common_1.HttpException(`Minimum payout amount is $${minimumPayoutAmount} `, 422);
        }
        if (payload.paymentAccountType === 'paypal') {
            const paypalAccount = await this.performerService.getPaymentSetting(user._id, 'paypal');
            if (!((_a = paypalAccount === null || paypalAccount === void 0 ? void 0 : paypalAccount.value) === null || _a === void 0 ? void 0 : _a.email)) {
                throw new common_1.HttpException('You have not provided your Paypal account yet, please try again later', 422);
            }
        }
        if (payload.paymentAccountType === 'banking') {
            const paymentAccountInfo = await this.performerService.getBankInfo(user._id);
            if (!paymentAccountInfo || !paymentAccountInfo.firstName || !paymentAccountInfo.lastName || !paymentAccountInfo.bankAccount) {
                throw new common_1.HttpException('Missing banking information', 404);
            }
        }
        const data = Object.assign(Object.assign({}, payload), { source: constants_2.SOURCE_TYPE.PERFORMER, tokenConversionRate: await this.settingService.getKeyValue(constants_1.SETTING_KEYS.TOKEN_CONVERSION_RATE) || 1, sourceId: user._id, updatedAt: new Date(), createdAt: new Date() });
        const query = {
            sourceId: user._id,
            source: constants_2.SOURCE_TYPE.PERFORMER,
            status: constants_2.STATUSES.PENDING
        };
        const request = await this.payoutRequestModel.findOne(query);
        if (request) {
            throw new exceptions_1.DuplicateRequestException();
        }
        if (user.balance < data.requestTokens) {
            throw new exceptions_1.InvalidRequestTokenException();
        }
        const resp = await this.payoutRequestModel.create(data);
        const adminEmail = (await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL)) || process.env.ADMIN_EMAIL;
        adminEmail && await this.mailService.send({
            subject: 'New payout request',
            to: adminEmail,
            data: {
                requestAmount: resp.requestTokens,
                paymentAccountType: resp.paymentAccountType,
                requestName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || 'N/A'
            },
            template: 'admin-payout-request'
        });
        return new payout_request_dto_1.PayoutRequestDto(resp);
    }
    async calculate(user, payload) {
        var _a, _b;
        let performerId = user._id;
        if (user.roles && user.roles.includes('admin') && payload.performerId) {
            performerId = payload.performerId;
        }
        const [totalEarnedTokens, previousPaidOutTokens, performer] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: {
                        performerId: (0, string_helper_1.toObjectId)(performerId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]),
            this.payoutRequestModel.aggregate([
                {
                    $match: {
                        sourceId: (0, string_helper_1.toObjectId)(performerId),
                        status: constants_2.STATUSES.DONE
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$requestTokens'
                        }
                    }
                }
            ]),
            this.performerService.findById((0, string_helper_1.toObjectId)(performerId))
        ]);
        return {
            totalEarnedTokens: ((_a = totalEarnedTokens[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            previousPaidOutTokens: ((_b = previousPaidOutTokens[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            remainingUnpaidTokens: performer.balance || 0
        };
    }
    async performerUpdate(id, payload, performer) {
        var _a;
        const payout = await this.payoutRequestModel.findOne({ _id: id });
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (payout.status !== 'processing') {
            throw new common_1.ForbiddenException();
        }
        if (performer._id.toString() !== payout.sourceId.toString()) {
            throw new common_1.ForbiddenException();
        }
        if (payload.paymentAccountType === 'paypal') {
            const paypalAccount = await this.performerService.getPaymentSetting(performer._id, 'paypal');
            if (!((_a = paypalAccount === null || paypalAccount === void 0 ? void 0 : paypalAccount.value) === null || _a === void 0 ? void 0 : _a.email)) {
                throw new common_1.HttpException('You have not provided your Paypal account yet, please try again later', 422);
            }
        }
        if (payload.paymentAccountType === 'banking') {
            const paymentAccountInfo = await this.performerService.getBankInfo(performer._id);
            if (!paymentAccountInfo || !paymentAccountInfo.firstName || !paymentAccountInfo.lastName || !paymentAccountInfo.bankAccount) {
                throw new common_1.HttpException('Missing banking information', 404);
            }
        }
        const minimumPayoutAmount = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT) || 50;
        if (payload.requestTokens < minimumPayoutAmount) {
            throw new common_1.HttpException(`Minimum payout amount is $${minimumPayoutAmount} `, 422);
        }
        if (performer.balance < payout.requestTokens) {
            throw new exceptions_1.InvalidRequestTokenException();
        }
        (0, lodash_1.merge)(payout, payload);
        payout.updatedAt = new Date();
        payout.tokenConversionRate = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.TOKEN_CONVERSION_RATE) || 1;
        await payout.save();
        return new payout_request_dto_1.PayoutRequestDto(payout);
    }
    async details(id, user) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user._id.toString() !== payout.sourceId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(payout);
        data.sourceInfo = new dtos_1.PerformerDto(user).toSearchResponse() || null;
        return data;
    }
    async adminDetails(id) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(payout);
        const { sourceId, source, paymentAccountType } = data;
        if (source === constants_2.SOURCE_TYPE.PERFORMER) {
            const sourceInfo = await this.performerService.findById(sourceId);
            if (sourceInfo) {
                data.sourceInfo = new dtos_1.PerformerDto(sourceInfo).toResponse();
                if (paymentAccountType === 'paypal') {
                    data.paymentAccountInfo = await this.performerService.getPaymentSetting(sourceInfo._id, 'paypal');
                }
                if (paymentAccountType === 'banking') {
                    data.paymentAccountInfo = await this.performerService.getBankInfo(sourceInfo._id);
                }
            }
        }
        return data;
    }
    async adminDelete(id) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if ([constants_2.STATUSES.DONE, constants_2.STATUSES.REJECTED].includes(payout.status)) {
            throw new common_1.ForbiddenException();
        }
        await this.payoutRequestModel.deleteOne({ _id: payout._id });
        return { deleted: true };
    }
    async adminUpdateStatus(id, payload) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = request.status;
        (0, lodash_1.merge)(request, payload);
        request.updatedAt = new Date();
        await request.save();
        const event = {
            channel: constants_2.PAYOUT_REQUEST_CHANEL,
            eventName: constants_2.PAYOUT_REQUEST_EVENT.UPDATED,
            data: {
                request,
                oldStatus
            }
        };
        await this.queueEventService.publish(event);
        return request;
    }
};
PayoutRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __param(1, (0, common_1.Inject)(payout_request_provider_1.PAYOUT_REQUEST_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => kernel_1.QueueEventService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => mailer_1.MailerService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => settings_1.SettingService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.PerformerService,
        mailer_1.MailerService,
        settings_1.SettingService])
], PayoutRequestService);
exports.PayoutRequestService = PayoutRequestService;
//# sourceMappingURL=payout-request.service.js.map