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
exports.ProductSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../performer/dtos");
const moment = require("moment");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
let ProductSearchService = class ProductSearchService {
    constructor(performerService, productModel, fileService) {
        this.performerService = performerService;
        this.productModel = productModel;
        this.fileService = fileService;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = data.map((d) => d.imageId);
        const products = data.map((v) => new dtos_2.ProductDto(v));
        const [performers, images] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : []
        ]);
        products.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = {
                    username: performer.username
                };
            }
            const file = images.length > 0 && v.imageId
                ? images.find((f) => f._id.toString() === v.imageId.toString())
                : null;
            if (file) {
                v.image = file.getUrl();
            }
        });
        return {
            data: products,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {
            performerId: user._id
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = data.map((d) => d.imageId);
        const products = data.map((v) => new dtos_2.ProductDto(v));
        const [performers, images] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : []
        ]);
        products.forEach((v) => {
            const performer = performers.find((p) => p && p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = {
                    username: performer.username
                };
            }
            const file = images.length > 0 && v.imageId
                ? images.find((f) => f._id.toString() === v.imageId.toString())
                : null;
            if (file) {
                v.image = file.getUrl();
            }
        });
        return {
            data: products,
            total
        };
    }
    async userSearch(req) {
        const query = {
            status: 'active'
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.excludedId)
            query._id = { $ne: req.excludedId };
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = data.map((d) => d.imageId);
        const products = data.map((v) => new dtos_2.ProductDto(v));
        const [performers, images] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : []
        ]);
        products.forEach((v) => {
            const performer = performers.find((f) => `${f._id}` === `${(v === null || v === void 0 ? void 0 : v.performerId) || ''}`);
            v.performer = performer ? new dtos_1.PerformerDto(performer).toResponse() : null;
            const file = images.find((f) => `${f._id}` === `${(v === null || v === void 0 ? void 0 : v.imageId) || ''}`);
            v.image = file ? file.getUrl() : '';
        });
        return {
            data: products,
            total
        };
    }
};
ProductSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        services_2.FileService])
], ProductSearchService);
exports.ProductSearchService = ProductSearchService;
//# sourceMappingURL=product-search.service.js.map