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
exports.PostSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const services_1 = require("../../user/services");
const providers_1 = require("../providers");
let PostSearchService = class PostSearchService {
    constructor(userService, postModel) {
        this.userService = userService;
        this.postModel = postModel;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            query.$or = [
                {
                    title: { $regex: req.q }
                }
            ];
        }
        if (req.status) {
            query.status = req.status;
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort
        };
        const [data, total] = await Promise.all([
            this.postModel
                .find(query)
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.postModel.countDocuments(query)
        ]);
        return {
            data,
            total
        };
    }
    async userSearch(req) {
        const query = {};
        query.status = 'published';
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort
        };
        const [data, total] = await Promise.all([
            this.postModel
                .find(query)
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.postModel.countDocuments(query)
        ]);
        return {
            data,
            total
        };
    }
};
PostSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(1, (0, common_1.Inject)(providers_1.POST_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.UserService,
        mongoose_1.Model])
], PostSearchService);
exports.PostSearchService = PostSearchService;
//# sourceMappingURL=post-search.service.js.map