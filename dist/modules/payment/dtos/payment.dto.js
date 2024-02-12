"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDto = exports.IPaymentResponse = void 0;
const lodash_1 = require("lodash");
class IPaymentResponse {
}
exports.IPaymentResponse = IPaymentResponse;
class PaymentDto {
    constructor(data) {
        data
            && Object.assign(this, (0, lodash_1.pick)(data, [
                '_id',
                'paymentGateway',
                'sourceInfo',
                'source',
                'sourceId',
                'performerId',
                'performerInfo',
                'target',
                'targetId',
                'type',
                'products',
                'paymentResponseInfo',
                'invoiceId',
                'stripeClientSecret',
                'status',
                'totalPrice',
                'originalPrice',
                'couponInfo',
                'createdAt',
                'updatedAt'
            ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            paymentGateway: this.paymentGateway,
            sourceId: this.sourceId,
            source: this.source,
            sourceInfo: this.sourceInfo,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            target: this.target,
            targetId: this.targetId,
            type: this.type,
            products: this.products,
            totalPrice: this.totalPrice,
            originalPrice: this.originalPrice,
            couponInfo: this.couponInfo,
            status: this.status,
            stripeClientSecret: this.stripeClientSecret,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        const privateInfo = {
            paymentResponseInfo: this.paymentResponseInfo,
            invoiceId: this.invoiceId
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.PaymentDto = PaymentDto;
//# sourceMappingURL=payment.dto.js.map