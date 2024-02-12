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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const moment = require("moment");
const constants_1 = require("../../payment/constants");
const subscription_provider_1 = require("../providers/subscription.provider");
const subscription_dto_1 = require("../dtos/subscription.dto");
const constants_2 = require("../constants");
let SubscriptionService = class SubscriptionService {
    constructor(userSearchService, performerService, userService, subscriptionModel) {
        this.userSearchService = userSearchService;
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionModel = subscriptionModel;
    }
    async updateSubscriptionId(transaction, subscriptionId) {
        const { sourceId: userId, performerId, _id: transactionId, paymentGateway = 'stripe', type } = transaction;
        let subscription = await this.subscriptionModel.findOne({ userId, performerId });
        if (!subscription) {
            subscription = await this.subscriptionModel.create({
                createdAt: new Date(),
                updatedAt: new Date(),
                expiredAt: new Date(),
                userId,
                performerId,
                transactionId
            });
        }
        subscription.status = type === constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION ? constants_2.SUBSCRIPTION_STATUS.ACTIVE : constants_2.SUBSCRIPTION_STATUS.CREATED;
        subscription.paymentGateway = paymentGateway;
        subscription.subscriptionId = subscriptionId;
        await subscription.save();
    }
    async findBySubscriptionId(subscriptionId) {
        return this.subscriptionModel.findOne({ subscriptionId });
    }
    async findSubscriptionList(query) {
        const data = await this.subscriptionModel.find(query);
        return data;
    }
    async adminCreate(data) {
        const payload = Object.assign({}, data);
        const existSubscription = await this.subscriptionModel.findOne({
            userId: payload.userId,
            performerId: payload.performerId
        });
        if (existSubscription && moment(existSubscription.expiredAt).isAfter(moment())) {
            throw new common_1.HttpException('You already have an existing subscription!', 422);
        }
        if (existSubscription) {
            existSubscription.expiredAt = new Date(payload.expiredAt);
            existSubscription.updatedAt = new Date();
            existSubscription.subscriptionType = payload.subscriptionType;
            existSubscription.status = constants_2.SUBSCRIPTION_STATUS.ACTIVE;
            existSubscription.paymentGateway = 'system';
            await existSubscription.save();
            return new subscription_dto_1.SubscriptionDto(existSubscription);
        }
        payload.createdAt = new Date();
        payload.updatedAt = new Date();
        payload.status = constants_2.SUBSCRIPTION_STATUS.ACTIVE;
        payload.paymentGateway = 'system';
        const newSubscription = await this.subscriptionModel.create(payload);
        await Promise.all([
            this.performerService.updateSubscriptionStat(newSubscription.performerId, 1),
            this.userService.updateStats(newSubscription.userId, { 'stats.totalSubscriptions': 1 })
        ]);
        return new subscription_dto_1.SubscriptionDto(newSubscription);
    }
    async adminUpdate(subscriptionId, data) {
        const subscription = await this.subscriptionModel.findById(subscriptionId);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        const payload = Object.assign({}, data);
        subscription.expiredAt = new Date(payload.expiredAt);
        subscription.updatedAt = new Date();
        subscription.subscriptionType = payload.subscriptionType;
        subscription.status = payload.status;
        await subscription.save();
        return new subscription_dto_1.SubscriptionDto(subscription);
    }
    async adminSearch(req) {
        const query = {
            status: { $ne: constants_2.SUBSCRIPTION_STATUS.CREATED }
        };
        if (req.userId) {
            query.userId = req.userId;
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        if (req.q) {
            query.subscriptionId = new RegExp(req.q, 'i');
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.status) {
            query.status = req.status;
            if (req.status === 'suspended') {
                query.status = 'active';
                query.expiredAt = {
                    $lt: new Date()
                };
            }
            else if (req.status === 'active') {
                query.status = 'active';
                query.expiredAt = {
                    $gt: new Date()
                };
            }
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const PIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            PIds.length ? this.performerService.findByIds(PIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const performer = performers.find((p) => p._id.toString() === subscription.performerId.toString());
            const user = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = (user && new dtos_1.UserDto(user).toResponse()) || null;
            subscription.performerInfo = (performer && new dtos_2.PerformerDto(performer).toResponse()) || null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {
            status: { $ne: constants_2.SUBSCRIPTION_STATUS.CREATED },
            performerId: user._id
        };
        if (req.userId) {
            query.userId = req.userId;
        }
        if (req.userIds) {
            query.userId = { $in: req.userIds };
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        if (req.status) {
            query.status = req.status;
            if (req.status === 'suspended') {
                query.status = 'active';
                query.expiredAt = {
                    $lt: new Date()
                };
            }
            else if (req.status === 'active') {
                query.status = 'active';
                query.expiredAt = {
                    $gt: new Date()
                };
            }
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.q) {
            const usersSearch = await this.userSearchService.searchByKeyword({ q: req.q });
            const Ids = usersSearch ? usersSearch.map((u) => u._id) : [];
            query.userId = { $in: Ids };
        }
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const [users] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const userSubscription = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = new dtos_1.UserDto(userSubscription).toResponse() || null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            userId: user._id,
            status: { $ne: constants_2.SUBSCRIPTION_STATUS.CREATED }
        };
        if (req.status) {
            query.status = req.status;
            if (req.status === 'suspended') {
                query.status = 'active';
                query.expiredAt = {
                    $lt: new Date()
                };
            }
            else if (req.status === 'active') {
                query.status = 'active';
                query.expiredAt = {
                    $gt: new Date()
                };
            }
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const PIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            PIds.length ? this.performerService.findByIds(PIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const performer = performers.find((p) => p._id.toString() === subscription.performerId.toString());
            const userSubscription = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = (userSubscription && new dtos_1.UserDto(userSubscription).toResponse()) || null;
            subscription.performerInfo = (performer && new dtos_2.PerformerDto(performer).toPublicDetailsResponse()) || null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async checkSubscribed(performerId, userId) {
        if (performerId.toString() === userId.toString()) {
            return 1;
        }
        return this.subscriptionModel.countDocuments({
            performerId,
            userId,
            expiredAt: { $gt: new Date() }
        });
    }
    async findOneSubscription(payload) {
        const subscription = await this.subscriptionModel.findOne(payload);
        return subscription;
    }
    async performerTotalSubscriptions(performerId) {
        const data = await this.subscriptionModel.countDocuments({ performerId, expiredAt: { $gt: new Date() } });
        return data;
    }
    async findById(id) {
        const data = await this.subscriptionModel.findById(id);
        return data;
    }
    async adminUpdateUserStats() {
        try {
            const [allUsers, allPerformers] = await Promise.all([
                this.userService.find({}),
                this.performerService.find({})
            ]);
            await Promise.all([
                allUsers.map(async (user) => {
                    const totalSub = await this.subscriptionModel.count({
                        userId: user._id,
                        status: constants_2.SUBSCRIPTION_STATUS.ACTIVE
                    });
                    await this.userService.updateOne({ _id: user._id }, {
                        $set: {
                            'stats.totalSubscriptions': totalSub
                        }
                    }, {});
                }),
                allPerformers.map(async (performer) => {
                    const totalSub = await this.subscriptionModel.count({
                        performerId: performer._id,
                        status: constants_2.SUBSCRIPTION_STATUS.ACTIVE
                    });
                    await this.performerService.updateOne({ _id: performer._id }, {
                        $set: {
                            'stats.subscribers': totalSub
                        }
                    }, {});
                })
            ]);
            return { success: true };
        }
        catch (error) {
            return { error };
        }
    }
};
SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserSearchService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(3, (0, common_1.Inject)(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.UserSearchService,
        services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map