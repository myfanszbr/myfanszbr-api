"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingAddressProviders = exports.orderProviders = exports.SHIPPING_ADDRESS_MODEL_PROVIDER = exports.ORDER_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.ORDER_MODEL_PROVIDER = 'ORDER_MODEL_PROVIDER';
exports.SHIPPING_ADDRESS_MODEL_PROVIDER = 'SHIPPING_ADDRESS_MODEL_PROVIDER';
exports.orderProviders = [
    {
        provide: exports.ORDER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('orders', schemas_1.OrderSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
exports.shippingAddressProviders = [
    {
        provide: exports.SHIPPING_ADDRESS_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('shippingAddresses', schemas_1.ShippingAddressSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map