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
exports.ShippingAddressService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
let ShippingAddressService = class ShippingAddressService {
    constructor(addressModel) {
        this.addressModel = addressModel;
    }
    async findOne(id, user) {
        const data = await this.addressModel.findById(id);
        if (`${data.sourceId}` !== `${user._id}`)
            throw new common_1.ForbiddenException();
        return data;
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { source: 'user', sourceId: user._id, updatedAt: new Date(), createdAt: new Date() });
        const resp = await this.addressModel.create(data);
        return resp;
    }
    async update(id, payload, user) {
        const address = await this.addressModel.findById(id);
        if (!address) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (`${address.sourceId}` !== `${user._id}`)
            throw new common_1.ForbiddenException();
        await this.addressModel.updateOne({ _id: id }, payload);
        return true;
    }
    async delete(id, user) {
        const address = await this.addressModel.findById(id);
        if (!address) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (`${address.sourceId}` !== `${user._id}`)
            throw new common_1.ForbiddenException();
        await this.addressModel.deleteOne({ _id: id });
        return true;
    }
    async search(req, user) {
        const query = {
            sourceId: user._id
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [
                { name: searchValue }
            ];
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.addressModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.addressModel.countDocuments(query)
        ]);
        return {
            data,
            total
        };
    }
};
ShippingAddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_1.SHIPPING_ADDRESS_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], ShippingAddressService);
exports.ShippingAddressService = ShippingAddressService;
//# sourceMappingURL=shipping-address.service.js.map