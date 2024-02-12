"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerBlockCountrySchema = void 0;
const mongoose_1 = require("mongoose");
exports.PerformerBlockCountrySchema = new mongoose_1.Schema({
    source: {
        type: String,
        index: true
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    countryCodes: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.PerformerBlockCountrySchema.index({ countries: 1 });
//# sourceMappingURL=performer-block-country.schema.js.map