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
exports.TokenTransactionSearchService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const lodash_1 = require("lodash");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let TokenTransactionSearchService = class TokenTransactionSearchService {
    constructor(userService, performerService, paymentTokenModel) {
        this.userService = userService;
        this.performerService = performerService;
        this.paymentTokenModel = paymentTokenModel;
    }
    async getUserTransactionsToken(req, user) {
        const query = {
            source: 'user',
            sourceId: user._id
        };
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.performerId)
            query.performerId = req.performerId;
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
            this.paymentTokenModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.paymentTokenModel.countDocuments(query)
        ]);
        const performerIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const [performers] = await Promise.all([
            this.performerService.findByIds(performerIds)
        ]);
        const transactions = data.map((d) => new dtos_1.TokenTransactionDto(d).toResponse(true));
        transactions.forEach((transaction) => {
            if (transaction.performerId) {
                const performerInfo = performers.find((t) => t._id.toString() === transaction.performerId.toString());
                if (performerInfo) {
                    transaction.performerInfo = performerInfo.toResponse();
                }
            }
        });
        return {
            total,
            data: transactions
        };
    }
    async adminGetUserTransactionsToken(req) {
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
            this.paymentTokenModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.paymentTokenModel.countDocuments(query)
        ]);
        const sourceIds = data.map((d) => d.sourceId);
        const performerIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            this.userService.findByIds(sourceIds),
            this.performerService.findByIds(performerIds)
        ]);
        const transactions = data.map((transaction) => {
            const sourceInfo = transaction.sourceId && users.find((t) => t._id.toString() === transaction.sourceId.toString());
            const performerInfo = transaction.performerId && performers.find((t) => t._id.toString() === transaction.performerId.toString());
            return Object.assign(Object.assign({}, transaction), { sourceInfo: sourceInfo && sourceInfo.toResponse(), performerInfo: performerInfo && performerInfo.toResponse() });
        });
        return {
            total,
            data: transactions.map((trans) => new dtos_1.TokenTransactionDto(trans).toResponse(true))
        };
    }
    async findByQuery(query) {
        const data = await this.paymentTokenModel.find(query);
        return data;
    }
};
TokenTransactionSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)(providers_1.PAYMENT_TOKEN_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.UserService,
        services_1.PerformerService,
        mongoose_1.Model])
], TokenTransactionSearchService);
exports.TokenTransactionSearchService = TokenTransactionSearchService;
//# sourceMappingURL=token-transaction-search.service.js.map