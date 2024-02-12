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
exports.TransactionMailerListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../mailer/services");
const settings_1 = require("../../settings");
const services_2 = require("../../performer/services");
const services_3 = require("../../user/services");
const constants_3 = require("../constants");
const MAILER_TRANSACTION = 'MAILER_TRANSACTION';
let TransactionMailerListener = class TransactionMailerListener {
    constructor(queueEventService, mailService, performerService, userService) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.performerService = performerService;
        this.userService = userService;
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, MAILER_TRANSACTION, this.handleMailerTransaction.bind(this));
    }
    async handleMailerTransaction(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const transaction = event.data;
        if (transaction.status !== constants_3.PAYMENT_STATUS.SUCCESS) {
            return;
        }
        const adminEmail = settings_1.SettingService.getByKey('adminEmail').value || process.env.ADMIN_EMAIL;
        const performer = await this.performerService.findById(transaction.performerId);
        const user = await this.userService.findById(transaction.sourceId);
        if (!user || !performer) {
            return;
        }
        if (performer && performer.email) {
            if ([constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION, constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION, constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION].includes(transaction.type)) {
                await this.mailService.send({
                    subject: 'New subscription',
                    to: performer.email,
                    data: {
                        performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                        userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                        transactionId: transaction._id.toString().slice(16, 24).toUpperCase(),
                        products: transaction.products
                    },
                    template: 'performer-new-subscription'
                });
            }
            else {
                await this.mailService.send({
                    subject: 'New payment success',
                    to: performer.email,
                    data: {
                        performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                        userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                        transactionId: transaction._id.toString().slice(16, 24).toUpperCase(),
                        products: transaction.products
                    },
                    template: 'performer-payment-success'
                });
            }
        }
        if (adminEmail) {
            await this.mailService.send({
                subject: 'New payment success',
                to: adminEmail,
                data: {
                    performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    transactionId: transaction._id.toString().slice(16, 24).toUpperCase(),
                    products: transaction.products
                },
                template: 'admin-payment-success'
            });
        }
        if (user.email) {
            await this.mailService.send({
                subject: 'New payment success',
                to: user.email,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    transactionId: transaction._id.toString().slice(16, 24).toUpperCase(),
                    products: transaction.products
                },
                template: 'user-payment-success'
            });
        }
    }
};
TransactionMailerListener = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.MailerService,
        services_2.PerformerService,
        services_3.UserService])
], TransactionMailerListener);
exports.TransactionMailerListener = TransactionMailerListener;
//# sourceMappingURL=transaction-success.listener.js.map