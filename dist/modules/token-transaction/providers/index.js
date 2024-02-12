"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTokenProviders = exports.PAYMENT_TOKEN_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PAYMENT_TOKEN_MODEL_PROVIDER = 'PAYMENT_TOKEN_MODEL_PROVIDER';
exports.paymentTokenProviders = [
    {
        provide: exports.PAYMENT_TOKEN_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PurchasedItem', schemas_1.TokenTransactionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map