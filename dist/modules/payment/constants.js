"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MISSING_CONFIG_PAYMENT_GATEWAY = exports.TRANSACTION_SUCCESS_CHANNEL = exports.PAYMENT_TARGET_TYPE = exports.PAYMENT_TYPE = exports.PAYMENT_STATUS = void 0;
exports.PAYMENT_STATUS = {
    CREATED: 'created',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAIL: 'fail',
    CANCELED: 'canceled',
    REFUNDED: 'refunded',
    REQUIRE_AUTHENTICATION: 'require_authentication'
};
exports.PAYMENT_TYPE = {
    TOKEN_PACKAGE: 'token_package',
    FREE_SUBSCRIPTION: 'free_subscription',
    MONTHLY_SUBSCRIPTION: 'monthly_subscription',
    YEARLY_SUBSCRIPTION: 'yearly_subscription'
};
exports.PAYMENT_TARGET_TYPE = {
    TOKEN_PACKAGE: 'token_package',
    PERFORMER: 'performer'
};
exports.TRANSACTION_SUCCESS_CHANNEL = 'TRANSACTION_SUCCESS_CHANNEL';
exports.MISSING_CONFIG_PAYMENT_GATEWAY = 'Missing config for this payment method';
//# sourceMappingURL=constants.js.map