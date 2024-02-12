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
exports.PaymentTokenListener = void 0;
const kernel_1 = require("../../../kernel");
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const constants_1 = require("../../../kernel/constants");
const mailer_1 = require("../../mailer");
const services_2 = require("../../user/services");
const settings_1 = require("../../settings");
const constants_2 = require("../constants");
const HANDLE_MAILER_TOPIC = 'HANDLE_MAILER_TOPIC';
let PaymentTokenListener = class PaymentTokenListener {
    constructor(performerService, userService, mailService, queueEventService) {
        this.performerService = performerService;
        this.userService = userService;
        this.mailService = mailService;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_2.TOKEN_TRANSACTION_SUCCESS_CHANNEL, HANDLE_MAILER_TOPIC, this.handleMailerTransaction.bind(this));
    }
    async handleMailerTransaction(event) {
        if (![constants_1.EVENT.CREATED, constants_1.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const transaction = event.data;
        if (transaction.status !== constants_2.PURCHASE_ITEM_STATUS.SUCCESS) {
            return;
        }
        if ([constants_2.PURCHASE_ITEM_TYPE.PRIVATE_CHAT, constants_2.PURCHASE_ITEM_TYPE.PUBLIC_CHAT, constants_2.PURCHASE_ITEM_TYPE.GROUP_CHAT].includes(transaction.type)) {
            return;
        }
        const adminEmail = await settings_1.SettingService.getByKey('adminEmail').value || process.env.ADMIN_EMAIL;
        const performer = await this.performerService.findById(transaction.performerId);
        const user = await this.userService.findById(transaction.sourceId);
        if (performer && performer.email) {
            if ([constants_2.PURCHASE_ITEM_TYPE.TIP, constants_2.PURCHASE_ITEM_TYPE.STREAM_TIP].includes(transaction.type)) {
                await this.mailService.send({
                    subject: 'You have a Tip',
                    to: performer.email,
                    data: {
                        performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username),
                        userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                        tipAmount: transaction.totalPrice
                    },
                    template: 'performer-tip-success'
                });
            }
            else {
                await this.mailService.send({
                    subject: 'New Wallet Purchased Success',
                    to: performer.email,
                    data: {
                        performer,
                        user,
                        transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
                    },
                    template: 'performer-payment-success'
                });
            }
        }
        if (adminEmail) {
            await this.mailService.send({
                subject: 'New Wallet Purchased Success',
                to: adminEmail,
                data: {
                    performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
                },
                template: 'admin-payment-success'
            });
        }
        if (user && user.email) {
            await this.mailService.send({
                subject: 'New Wallet Purchased Success',
                to: user.email,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
                },
                template: 'user-payment-success'
            });
        }
    }
};
PaymentTokenListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.UserService,
        mailer_1.MailerService,
        kernel_1.QueueEventService])
], PaymentTokenListener);
exports.PaymentTokenListener = PaymentTokenListener;
//# sourceMappingURL=payment-token.listener.js.map