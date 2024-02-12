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
exports.EarningService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const moment = require("moment");
const earning_provider_1 = require("../providers/earning.provider");
const services_2 = require("../../performer/services");
const earning_dto_1 = require("../dtos/earning.dto");
const dtos_2 = require("../../performer/dtos");
const services_3 = require("../../payment/services");
let EarningService = class EarningService {
    constructor(userService, performerService, earningModel, paymentService) {
        this.userService = userService;
        this.performerService = performerService;
        this.earningModel = earningModel;
        this.paymentService = paymentService;
    }
    async adminSearch(req) {
        const query = {};
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.transactionId) {
            query.transactionId = req.transactionId;
        }
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.isToken) {
            query.isToken = req.isToken === 'true';
        }
        if (req.isPaid) {
            query.isPaid = req.isPaid;
        }
        const sort = {
            createdAt: -1
        };
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const [data, total] = await Promise.all([
            this.earningModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.earningModel.countDocuments(query)
        ]);
        const earnings = data.map((d) => new earning_dto_1.EarningDto(d));
        const PIds = data.map((d) => d.performerId);
        const UIds = data.map((d) => d.userId);
        const [users, performers] = await Promise.all([
            this.userService.findByIds(UIds) || [],
            this.performerService.findByIds(PIds) || []
        ]);
        earnings.forEach((earning) => {
            const performer = earning.performerId && performers.find((p) => p._id.toString() === earning.performerId.toString());
            earning.performerInfo = performer
                ? new dtos_2.PerformerDto(performer).toResponse()
                : null;
            const user = earning.userId && users.find((p) => p._id.toString() === earning.userId.toString());
            earning.userInfo = user
                ? new dtos_1.UserDto(user).toResponse()
                : null;
        });
        return {
            data: earnings,
            total
        };
    }
    async search(req, user) {
        const query = {
            performerId: user._id
        };
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.isToken) {
            query.isToken = req.isToken === 'true';
        }
        if (req.isPaid) {
            query.isPaid = req.isPaid;
        }
        const sort = {
            createdAt: -1
        };
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const [data, total] = await Promise.all([
            this.earningModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.earningModel.countDocuments(query)
        ]);
        const earnings = data.map((d) => new earning_dto_1.EarningDto(d));
        const UIds = data.map((d) => d.userId);
        const [users] = await Promise.all([
            this.userService.findByIds(UIds) || []
        ]);
        earnings.forEach((earning) => {
            const u = earning.userId && users.find((p) => p._id.toString() === earning.userId.toString());
            earning.userInfo = u
                ? new dtos_1.UserDto(u).toResponse()
                : null;
        });
        return {
            data: earnings,
            total
        };
    }
    async details(id) {
        const earning = await this.earningModel.findById((0, string_helper_1.toObjectId)(id));
        const transaction = await this.paymentService.findById(earning.transactionId);
        if (!earning || !transaction) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [user, performer] = await Promise.all([
            this.userService.findById(earning.userId),
            this.performerService.findById(earning.performerId)
        ]);
        const data = new earning_dto_1.EarningDto(earning);
        data.userInfo = user ? new dtos_1.UserDto(user).toResponse(true, true) : null;
        data.performerInfo = performer
            ? new dtos_2.PerformerDto(performer).toResponse(true, true)
            : null;
        data.transactionInfo = transaction;
        return data;
    }
    async stats(req) {
        const query = {};
        if (req.performerId) {
            query.performerId = (0, string_helper_1.toObjectId)(req.performerId);
        }
        if (req.transactionId) {
            query.transactionId = req.transactionId;
        }
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.isToken) {
            query.isToken = req.isToken === 'true';
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const [totalGrossPrice, totalNetPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$grossPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        const totalGross = (totalGrossPrice && totalGrossPrice.length && totalGrossPrice[0].total) || 0;
        const totalNet = (totalNetPrice && totalNetPrice.length && totalNetPrice[0].total) || 0;
        const totalSiteCommission = totalGross - totalNet;
        return {
            totalGrossPrice: totalGross,
            totalNetPrice: totalNet,
            totalSiteCommission
        };
    }
    async updatePaidStatus(payload) {
        if (!payload.fromDate || payload.fromDate === 'undefined')
            throw new Error('Date invalid');
        if (!payload.toDate || payload.toDate === 'undefined')
            throw new Error('Date invalid');
        const query = {};
        if (payload.fromDate && payload.toDate) {
            query.createdAt = {
                $gt: new Date(payload.fromDate),
                $lte: new Date(payload.toDate)
            };
        }
        if (payload.performerId) {
            query.performerId = payload.performerId;
        }
        return this.earningModel.updateMany(query, {
            $set: { isPaid: true, paidAt: new Date() }
        });
    }
};
EarningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(2, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.PerformerService,
        mongoose_1.Model,
        services_3.PaymentService])
], EarningService);
exports.EarningService = EarningService;
//# sourceMappingURL=earning.service.js.map