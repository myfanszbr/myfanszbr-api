"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentProviders = exports.PAYMENT_CARD_MODEL_PROVIDER = exports.PAYMENT_CUSTOMER_MODEL_PROVIDER = exports.SUBSCRIPTION_PLAN_MODEL_PROVIDER = exports.PAYMENT_TRANSACTION_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PAYMENT_TRANSACTION_MODEL_PROVIDER = 'PAYMENT_TRANSACTION_MODEL_PROVIDER';
exports.SUBSCRIPTION_PLAN_MODEL_PROVIDER = 'SUBSCRIPTION_PLAN_MODEL_PROVIDER';
exports.PAYMENT_CUSTOMER_MODEL_PROVIDER = 'PAYMENT_CUSTOMER_MODEL_PROVIDER';
exports.PAYMENT_CARD_MODEL_PROVIDER = 'PAYMENT_CARD_MODEL_PROVIDER';
exports.paymentProviders = [
    {
        provide: exports.PAYMENT_TRANSACTION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PaymentTransaction', schemas_1.PaymentTransactionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.SUBSCRIPTION_PLAN_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('SubscriptionPlans', schemas_1.SubscriptionPlanSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PAYMENT_CUSTOMER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PaymentCustomer', schemas_1.PaymentCustomerSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PAYMENT_CARD_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PaymentCard', schemas_1.PaymentCardSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map