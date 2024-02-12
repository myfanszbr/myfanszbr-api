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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const services_2 = require("../../performer-assets/services");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const dtos_1 = require("../../performer/dtos");
const mailer_1 = require("../../mailer");
const lodash_1 = require("lodash");
const services_3 = require("../../user/services");
const constants_1 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
const dtos_2 = require("../dtos");
let OrderService = class OrderService {
    constructor(userService, performerService, productService, orderModel, addressModel, mailService, queueEventService) {
        this.userService = userService;
        this.performerService = performerService;
        this.productService = productService;
        this.orderModel = orderModel;
        this.addressModel = addressModel;
        this.mailService = mailService;
        this.queueEventService = queueEventService;
    }
    async findById(id) {
        return this.orderModel.findById(id);
    }
    async findByIds(ids) {
        return this.orderModel.find({ _id: { $in: ids } });
    }
    async findByQuery(payload) {
        const data = await this.orderModel.find(payload);
        return data;
    }
    async search(req, user) {
        const query = {
            performerId: user._id
        };
        if (user.roles && user.roles.includes('admin'))
            delete query.performerId;
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.deliveryStatus)
            query.deliveryStatus = req.deliveryStatus;
        if (req.phoneNumber)
            query.phoneNumber = { $regex: req.phoneNumber };
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
            this.orderModel
                .find(query)
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.orderModel.countDocuments(query)
        ]);
        const PIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const UIds = (0, lodash_1.uniq)(data.map((d) => d.userId));
        const productIds = (0, lodash_1.uniq)(data.map((d) => d.productId));
        const [performers, users, products] = await Promise.all([
            PIds.length ? this.performerService.findByIds(PIds) : [],
            UIds.length ? this.userService.findByIds(UIds) : [],
            productIds.length ? this.productService.findByIds(productIds) : []
        ]);
        const orders = data.map((v) => new dtos_2.OrderDto(v));
        orders.forEach((order) => {
            if (order.performerId) {
                const performerInfo = performers.find((t) => t._id.toString() === order.performerId.toString());
                if (performerInfo) {
                    order.performerInfo = performerInfo.toResponse();
                }
            }
            if (order.userId) {
                const userInfo = users.find((t) => t._id.toString() === order.userId.toString());
                if (userInfo) {
                    order.userInfo = userInfo.toResponse();
                }
            }
            if (order.productId) {
                const productInfo = products.find((p) => order.productId.toString() === p._id.toString());
                order.productInfo = productInfo || null;
            }
        });
        return {
            data: orders,
            total
        };
    }
    async findOne(id) {
        const order = await this.findById(id);
        if (!order) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [user, performer, product] = await Promise.all([
            this.userService.findById(order.userId),
            this.performerService.findById(order.performerId),
            this.productService.findById(order.productId)
        ]);
        const newOrder = new dtos_2.OrderDto(order);
        if (user) {
            newOrder.userInfo = new dtos_1.PerformerDto(user).toResponse();
        }
        if (performer) {
            newOrder.performerInfo = new dtos_1.PerformerDto(performer).toResponse();
        }
        if (product) {
            newOrder.productInfo = product;
        }
        return newOrder;
    }
    async update(id, payload) {
        const data = Object.assign({}, payload);
        const order = await this.findById(id);
        if (!order) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.orderModel.updateOne({ _id: id }, data);
        const [user] = await Promise.all([
            this.userService.findById(order.userId)
        ]);
        if (data.deliveryStatus !== constants_2.ORDER_STATUS.PROCESSING) {
            (user === null || user === void 0 ? void 0 : user.email) && await this.mailService.send({
                subject: 'Order Status Changed',
                to: user.email,
                data: {
                    user,
                    order,
                    deliveryStatus: data.deliveryStatus
                },
                template: 'update-order-status'
            });
        }
        if (data.deliveryStatus === constants_2.ORDER_STATUS.REFUNDED) {
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_2.REFUND_ORDER_CHANNEL,
                eventName: constants_1.EVENT.CREATED,
                data: new dtos_2.OrderDto(order)
            }));
            (user === null || user === void 0 ? void 0 : user.email) && await this.mailService.send({
                subject: 'Order Refunded',
                to: user === null || user === void 0 ? void 0 : user.email,
                data: {
                    orderNumber: order.orderNumber,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)
                },
                template: 'user-refunded-order'
            });
        }
        return { success: true };
    }
    async userSearch(req, user) {
        const query = {
            userId: user._id
        };
        if (req.deliveryStatus)
            query.deliveryStatus = req.deliveryStatus;
        if (req.phoneNumber)
            query.phoneNumber = { $regex: req.phoneNumber };
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
            this.orderModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.orderModel.countDocuments(query)
        ]);
        const PIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const productIds = (0, lodash_1.uniq)(data.map((d) => d.productId));
        const [performers, products] = await Promise.all([
            this.performerService.findByIds(PIds),
            this.productService.findByIds(productIds)
        ]);
        const orders = data.map((v) => new dtos_2.OrderDto(v));
        orders.forEach((order) => {
            if (order.performerId) {
                const performerInfo = performers.find((t) => `${t === null || t === void 0 ? void 0 : t._id}` === `${order === null || order === void 0 ? void 0 : order.performerId}`);
                if (performerInfo) {
                    order.performerInfo = performerInfo.toResponse();
                }
                if (order.productId) {
                    const productInfo = products.find((p) => `${order === null || order === void 0 ? void 0 : order.productId}` === `${p === null || p === void 0 ? void 0 : p._id}`);
                    order.productInfo = productInfo || null;
                }
            }
        });
        return {
            data: orders,
            total
        };
    }
    async updateDeliveryAddress(id, payload, user) {
        const order = await this.findById(id);
        if (!order || !payload.deliveryAddressId) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (`${order.userId}` !== `${user._id}`)
            throw new common_1.ForbiddenException();
        if (order.deliveryStatus !== constants_2.ORDER_STATUS.PROCESSING)
            throw new common_1.ForbiddenException();
        if ((order === null || order === void 0 ? void 0 : order.deliveryAddressId) && (payload === null || payload === void 0 ? void 0 : payload.deliveryAddressId) && `${order === null || order === void 0 ? void 0 : order.deliveryAddressId}` !== `${payload === null || payload === void 0 ? void 0 : payload.deliveryAddressId}`) {
            const performer = await this.performerService.findById(order.performerId);
            (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailService.send({
                subject: 'Order Delivery Address Changed',
                to: performer === null || performer === void 0 ? void 0 : performer.email,
                data: {
                    order
                },
                template: 'update-order-delivery-address'
            });
        }
        const address = await this.addressModel.findById(payload.deliveryAddressId);
        const deliveryAddress = address ? `${address.name.toUpperCase()} - ${address.streetNumber || ''} ${address.streetAddress || ''} ${address.ward || ''} ${address.district || ''} ${address.city || ''} ${address.state || ''} ${address.zipCode || ''}, ${address.country}` : '';
        order.deliveryAddressId = payload.deliveryAddressId;
        order.deliveryAddress = deliveryAddress;
        await order.save();
        return new dtos_2.OrderDto(order);
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.ProductService))),
    __param(3, (0, common_1.Inject)(providers_1.ORDER_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_1.SHIPPING_ADDRESS_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_3.UserService,
        services_1.PerformerService,
        services_2.ProductService,
        mongoose_1.Model,
        mongoose_1.Model,
        mailer_1.MailerService,
        kernel_1.QueueEventService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map