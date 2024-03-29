"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
let BlockService = class BlockService {
    constructor(blockCountryModel, blockedByPerformerModel) {
        this.blockCountryModel = blockCountryModel;
        this.blockedByPerformerModel = blockedByPerformerModel;
    }
    async create(payload) {
        const country = await this.blockCountryModel.findOne({ countryCode: payload.countryCode });
        if (country) {
            return 'ALREADY_BLOCKED';
        }
        return this.blockCountryModel.create({
            countryCode: payload.countryCode,
            createdAt: new Date()
        });
    }
    async search() {
        return this.blockCountryModel.find({});
    }
    async delete(code) {
        const country = await this.blockCountryModel.findOne({ countryCode: code });
        if (!country) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.blockCountryModel.deleteOne({ _id: country._id });
        return true;
    }
    async checkCountryBlock(countryCode) {
        const country = await this.blockCountryModel.countDocuments({ countryCode });
        return { blocked: country > 0 };
    }
    async userSearch(userId) {
        const blocks = await this.blockedByPerformerModel.find({ targetId: userId });
        return blocks;
    }
};
BlockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_1.SITE_BLOCK_COUNTRY_PROVIDER)),
    __param(1, (0, common_1.Inject)(providers_1.PERFORMER_BLOCK_USER_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], BlockService);
exports.BlockService = BlockService;
//# sourceMappingURL=block.service.js.map