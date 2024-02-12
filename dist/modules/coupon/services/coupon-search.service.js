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
exports.CouponSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let CouponSearchService = class CouponSearchService {
    constructor(couponModel) {
        this.couponModel = couponModel;
    }
    async search(req) {
        const query = {};
        if (req.q) {
            query.$or = [
                {
                    name: { $regex: req.q }
                },
                {
                    code: { $regex: req.q }
                }
            ];
        }
        if (req.status) {
            query.status = req.status;
        }
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.couponModel
                .find(query)
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.couponModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_1.CouponDto(item)),
            total
        };
    }
};
CouponSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_1.COUPON_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CouponSearchService);
exports.CouponSearchService = CouponSearchService;
//# sourceMappingURL=coupon-search.service.js.map