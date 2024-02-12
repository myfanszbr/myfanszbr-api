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
exports.HandleDeleteItemListener = void 0;
const kernel_1 = require("../../../kernel");
const common_1 = require("@nestjs/common");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const providers_1 = require("../../performer/providers");
const constants_2 = require("../../token-transaction/constants");
const providers_2 = require("../../token-transaction/providers");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const providers_3 = require("../../user/providers");
const constants_3 = require("../../order/constants");
const providers_4 = require("../../order/providers");
const settings_1 = require("../../settings");
const constants_4 = require("../../settings/constants");
const mailer_1 = require("../../mailer");
const earning_provider_1 = require("../providers/earning.provider");
const HANDLE_REFUND_ORDER_EARNING_TOPIC = 'HANDLE_REFUND_ORDER_EARNING_TOPIC';
let HandleDeleteItemListener = class HandleDeleteItemListener {
    constructor(orderModel, earningModel, performerModel, userModel, tokenTransactionModel, queueEventService, socketUserService, mailerService) {
        this.orderModel = orderModel;
        this.earningModel = earningModel;
        this.performerModel = performerModel;
        this.userModel = userModel;
        this.tokenTransactionModel = tokenTransactionModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.mailerService = mailerService;
        this.queueEventService.subscribe(constants_3.REFUND_ORDER_CHANNEL, HANDLE_REFUND_ORDER_EARNING_TOPIC, this.handleRefundOrder.bind(this));
    }
    async handleRefundOrder(event) {
        if (![constants_1.EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const { transactionId } = event.data;
        const earning = await this.earningModel.findOne({
            transactionId
        });
        if (!earning)
            return;
        await Promise.all([
            this.orderModel.updateOne({ transactionId }, { deliveryStatus: constants_3.ORDER_STATUS.REFUNDED }),
            this.tokenTransactionModel.updateOne({ _id: transactionId }, { status: constants_2.PURCHASE_ITEM_STATUS.REFUNDED }),
            this.userModel.updateOne({ _id: earning.userId }, { $inc: { balance: earning.grossPrice } }),
            this.performerModel.updateOne({ _id: earning.performerId }, { $inc: { balance: -earning.netPrice } }),
            this.notifyUserBalance(earning),
            this.notifyPerformerBalance(earning.performerId, -earning.netPrice),
            this.earningModel.deleteOne({ _id: earning._id })
        ]);
        const order = await this.orderModel.findOne({ transactionId });
        const adminEmail = settings_1.SettingService.getValueByKey(constants_4.SETTING_KEYS.ADMIN_EMAIL);
        order && adminEmail && await this.mailerService.send({
            subject: 'Order Refunded',
            to: adminEmail,
            data: {
                orderNumber: order.orderNumber
            },
            template: 'admin-refund-order'
        });
    }
    async notifyPerformerBalance(performerId, token) {
        this.socketUserService.emitToUsers(performerId, 'update_balance', {
            token
        });
    }
    async notifyUserBalance(earning) {
        this.socketUserService.emitToUsers(earning.userId, 'update_balance', {
            token: earning.grossPrice
        });
    }
};
HandleDeleteItemListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_4.ORDER_MODEL_PROVIDER)),
    __param(1, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_1.PERFORMER_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_3.USER_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_2.PAYMENT_TOKEN_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        mailer_1.MailerService])
], HandleDeleteItemListener);
exports.HandleDeleteItemListener = HandleDeleteItemListener;
//# sourceMappingURL=item-delete.listener.js.map