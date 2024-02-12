"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDto = void 0;
const lodash_1 = require("lodash");
class OrderDto {
    constructor(data) {
        data
            && Object.assign(this, (0, lodash_1.pick)(data, [
                '_id',
                'transactionId',
                'performerId',
                'performerInfo',
                'userId',
                'userInfo',
                'orderNumber',
                'shippingCode',
                'productId',
                'productInfo',
                'quantity',
                'unitPrice',
                'totalPrice',
                'deliveryAddress',
                'deliveryStatus',
                'deliveryAddressId',
                'userNote',
                'phoneNumber',
                'createdAt',
                'updatedAt'
            ]));
    }
}
exports.OrderDto = OrderDto;
//# sourceMappingURL=order.dto.js.map