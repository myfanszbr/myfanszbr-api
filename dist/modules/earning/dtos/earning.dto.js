"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningDto = void 0;
const lodash_1 = require("lodash");
class EarningDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'userId',
            'userInfo',
            'transactionId',
            'transactionInfo',
            'performerId',
            'performerInfo',
            'sourceType',
            'type',
            'grossPrice',
            'netPrice',
            'isPaid',
            'siteCommission',
            'createdAt',
            'updatedAt',
            'paidAt',
            'paymentGateway',
            'isToken'
        ]));
    }
}
exports.EarningDto = EarningDto;
//# sourceMappingURL=earning.dto.js.map