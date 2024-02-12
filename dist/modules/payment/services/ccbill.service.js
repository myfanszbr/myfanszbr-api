"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCBillService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../subscription/constants");
const crypto = require('crypto');
let CCBillService = class CCBillService {
    subscription(options) {
        const { transactionId, price, flexformId, salt, recurringSubAccountNumber, subscriptionType } = options;
        const initialPrice = price.toFixed(2);
        const initialPeriod = [constants_1.SUBSCRIPTION_TYPE.MONTHLY, 'monthly_subscription'].includes(subscriptionType) ? 30 : 365;
        const currencyCode = '840';
        const numRebills = '99';
        if (!salt || !flexformId || !recurringSubAccountNumber || !transactionId || !initialPrice) {
            throw new kernel_1.EntityNotFoundException();
        }
        const formDigest = crypto.createHash('md5')
            .update(`${initialPrice}${initialPeriod}${initialPrice}${initialPeriod}${numRebills}${currencyCode}${salt}`).digest('hex');
        return {
            paymentUrl: `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId}?transactionId=${transactionId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&recurringPrice=${initialPrice}&recurringPeriod=${initialPeriod}&numRebills=${numRebills}&clientSubacc=${recurringSubAccountNumber}&currencyCode=${currencyCode}&formDigest=${formDigest}`
        };
    }
    singlePurchase(options) {
        const { transactionId, price, salt, flexformId, singleSubAccountNumber, currencyCode: currency } = options;
        const initialPrice = price.toFixed(2);
        const currencyCode = currency || '840';
        const initialPeriod = 30;
        if (!salt || !flexformId || !singleSubAccountNumber || !transactionId || !initialPrice) {
            throw new kernel_1.EntityNotFoundException();
        }
        const formDigest = crypto.createHash('md5')
            .update(`${initialPrice}${initialPeriod}${currencyCode}${salt}`)
            .digest('hex');
        return {
            paymentUrl: `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId}?transactionId=${transactionId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&clientSubacc=${singleSubAccountNumber}&currencyCode=${currencyCode}&formDigest=${formDigest}`
        };
    }
};
CCBillService = __decorate([
    (0, common_1.Injectable)()
], CCBillService);
exports.CCBillService = CCBillService;
//# sourceMappingURL=ccbill.service.js.map