"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTransactionDto = void 0;
const lodash_1 = require("lodash");
class TokenTransactionDto {
    constructor(data) {
        data
            && Object.assign(this, (0, lodash_1.pick)(data, [
                '_id',
                'sourceInfo',
                'source',
                'sourceId',
                'performerId',
                'performerInfo',
                'target',
                'targetId',
                'sessionId',
                'type',
                'products',
                'status',
                'totalPrice',
                'originalPrice',
                'createdAt',
                'updatedAt',
                'digitalProducts',
                'shippingInfo'
            ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            sourceId: this.sourceId,
            source: this.source,
            sourceInfo: this.sourceInfo,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            target: this.target,
            targetId: this.targetId,
            sessionId: this.sessionId,
            type: this.type,
            products: this.products,
            totalPrice: this.totalPrice,
            originalPrice: this.originalPrice,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        const privateInfo = { shippingInfo: this.shippingInfo };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.TokenTransactionDto = TokenTransactionDto;
//# sourceMappingURL=token-transaction.dto.js.map