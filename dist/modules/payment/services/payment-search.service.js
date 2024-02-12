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
exports.PaymentSearchService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let PaymentSearchService = class PaymentSearchService {
    constructor(userService, performerService, paymentTransactionModel) {
        this.userService = userService;
        this.performerService = performerService;
        this.paymentTransactionModel = paymentTransactionModel;
    }
    async getUserTransactions(req, user) {
        const query = {
            sourceId: user._id
        };
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.performerIds)
            query.performerId = { $in: req.performerIds };
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.paymentTransactionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.paymentTransactionModel.countDocuments(query)
        ]);
        const PIds = data.map((d) => d.performerId);
        const [performers] = await Promise.all([
            this.performerService.findByIds(PIds)
        ]);
        const transactions = data.map((v) => new dtos_1.PaymentDto(v));
        transactions.forEach((transaction) => {
            if (transaction.performerId) {
                const performerInfo = performers.find((t) => t._id.toString() === transaction.performerId.toString());
                if (performerInfo) {
                    transaction.performerInfo = performerInfo.toResponse();
                }
            }
        });
        return {
            data: transactions.map((trans) => new dtos_1.PaymentDto(trans).toResponse(false)),
            total
        };
    }
    async adminGetUserTransactions(req) {
        const query = {};
        if (req.sourceId)
            query.sourceId = req.sourceId;
        if (req.source)
            query.source = req.source;
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.target)
            query.target = req.target;
        if (req.targetId)
            query.targetId = req.targetId;
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.performerIds)
            query.performerId = { $in: req.performerIds };
        if (req.paymentGateway)
            query.paymentGateway = req.paymentGateway;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.paymentTransactionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.paymentTransactionModel.countDocuments(query)
        ]);
        const UIds = data.map((d) => d.sourceId);
        const PIds = data.map((d) => d.targetId);
        const [users, performers] = await Promise.all([
            this.userService.findByIds(UIds),
            this.performerService.findByIds(PIds)
        ]);
        const transactions = data.map((v) => new dtos_1.PaymentDto(v));
        transactions.forEach((transaction) => {
            if (transaction.sourceId) {
                const sourceInfo = users.find((t) => t._id.toString() === transaction.sourceId.toString());
                if (sourceInfo) {
                    transaction.sourceInfo = sourceInfo.toResponse();
                }
            }
            if (transaction.performerId) {
                const performerInfo = performers.find((t) => t._id.toString() === transaction.performerId.toString());
                if (performerInfo) {
                    transaction.performerInfo = performerInfo.toResponse();
                }
            }
        });
        return {
            data: transactions.map((trans) => new dtos_1.PaymentDto(trans).toResponse(true)),
            total
        };
    }
    async findByQuery(query) {
        return this.paymentTransactionModel.find(query);
    }
};
PaymentSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.UserService,
        services_1.PerformerService,
        mongoose_1.Model])
], PaymentSearchService);
exports.PaymentSearchService = PaymentSearchService;
//# sourceMappingURL=payment-search.service.js.map