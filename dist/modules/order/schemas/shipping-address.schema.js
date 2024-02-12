"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ShippingAddressSchema = new mongoose_1.Schema({
    source: {
        type: String,
        index: true,
        default: 'user'
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    name: String,
    country: String,
    state: String,
    city: String,
    district: String,
    ward: String,
    streetNumber: String,
    streetAddress: String,
    zipCode: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=shipping-address.schema.js.map