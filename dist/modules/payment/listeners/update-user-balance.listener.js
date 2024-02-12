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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserBalanceListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../user/services");
const constants_3 = require("../constants");
const UPDATE_USER_BALANCE_TOPIC = 'UPDATE_USER_BALANCE_TOPIC';
let UpdateUserBalanceListener = class UpdateUserBalanceListener {
    constructor(queueEventService, userService) {
        this.queueEventService = queueEventService;
        this.userService = userService;
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, UPDATE_USER_BALANCE_TOPIC, this.handleUpdateUser.bind(this));
    }
    async handleUpdateUser(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const transaction = event.data;
        if (transaction.status !== constants_3.PAYMENT_STATUS.SUCCESS) {
            return;
        }
        if (transaction.type === constants_1.PAYMENT_TYPE.TOKEN_PACKAGE) {
            await this.userService.updateBalance(transaction.sourceId, transaction.products[0].tokens);
        }
    }
};
UpdateUserBalanceListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.UserService])
], UpdateUserBalanceListener);
exports.UpdateUserBalanceListener = UpdateUserBalanceListener;
//# sourceMappingURL=update-user-balance.listener.js.map