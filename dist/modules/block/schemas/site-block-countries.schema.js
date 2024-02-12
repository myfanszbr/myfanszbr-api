"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCountrySchema = exports.siteBlockCountrySchema = void 0;
const mongoose = require("mongoose");
exports.siteBlockCountrySchema = new mongoose.Schema({
    countryCode: { type: String, index: true, unique: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.BlockCountrySchema = exports.siteBlockCountrySchema;
//# sourceMappingURL=site-block-countries.schema.js.map