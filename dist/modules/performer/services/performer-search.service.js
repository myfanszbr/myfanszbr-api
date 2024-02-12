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
exports.PerformerSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const follow_service_1 = require("../../follow/services/follow.service");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const constants_1 = require("../constants");
let PerformerSearchService = class PerformerSearchService {
    constructor(followService, performerModel) {
        this.followService = followService;
        this.performerModel = performerModel;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [
                { firstName: searchValue },
                { lastName: searchValue },
                { name: searchValue },
                { username: searchValue },
                { email: searchValue }
            ];
        }
        if (req.performerIds) {
            query._id = { $in: req.performerIds };
        }
        ['hair', 'pubicHair', 'ethnicity', 'country', 'bodyType', 'gender', 'status',
            'height', 'weight', 'eyes', 'butt', 'sexualOrientation'].forEach((f) => {
            if (req[f]) {
                query[f] = req[f];
            }
        });
        if (req.verifiedDocument) {
            query.verifiedDocument = req.verifiedDocument === 'true';
        }
        if (req.verifiedEmail) {
            query.verifiedEmail = req.verifiedEmail === 'true';
        }
        if (req.verifiedAccount) {
            query.verifiedAccount = req.verifiedAccount === 'true';
        }
        if (req.isFeatured) {
            query.isFeatured = req.isFeatured === 'true';
        }
        if (req.fromAge && req.toAge) {
            query.dateOfBirth = {
                $gte: new Date(req.fromAge),
                $lte: new Date(req.toAge)
            };
        }
        if (req.age) {
            const fromAge = req.age.split('_')[0];
            const toAge = req.age.split('_')[1];
            const fromDate = moment().subtract(toAge, 'years').startOf('day').toDate();
            const toDate = moment().subtract(fromAge, 'years').startOf('day').toDate();
            query.dateOfBirth = {
                $gte: fromDate,
                $lte: toDate
            };
        }
        let sort = {
            isOnline: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.performerModel.countDocuments(query)
        ]);
        const performers = data.map((d) => new dtos_1.PerformerDto(d).toResponse(true));
        return {
            data: performers,
            total
        };
    }
    async search(req, user) {
        const query = {
            status: constants_1.PERFORMER_STATUSES.ACTIVE,
            verifiedDocument: true
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [
                { name: searchValue },
                { username: searchValue }
            ];
        }
        if (req.performerIds) {
            query._id = { $in: req.performerIds };
        }
        ['hair', 'pubicHair', 'ethnicity', 'country', 'bodyType', 'gender',
            'height', 'weight', 'eyes', 'butt', 'sexualOrientation'].forEach((f) => {
            if (req[f]) {
                query[f] = req[f];
            }
        });
        if (req.fromAge && req.toAge) {
            query.dateOfBirth = {
                $gte: moment(req.fromAge).startOf('day').toDate(),
                $lte: new Date(req.toAge)
            };
        }
        if (req.age) {
            const fromAge = req.age.split('_')[0];
            const toAge = req.age.split('_')[1];
            const fromDate = moment().subtract(toAge, 'years').startOf('day');
            const toDate = moment().subtract(fromAge, 'years').startOf('day');
            query.dateOfBirth = {
                $gte: fromDate,
                $lte: toDate
            };
        }
        if (req.isFreeSubscription) {
            query.isFreeSubscription = req.isFreeSubscription === 'true';
        }
        if (req.isFeatured) {
            query.isFeatured = req.isFeatured === 'true';
        }
        if (req.categoryIds) {
            query.categoryIds = { $in: [req.categoryIds] };
        }
        if ((user === null || user === void 0 ? void 0 : user._id) && req.followed === 'true') {
            const follows = await this.followService.find({
                followerId: user._id
            });
            const perIds = follows.map((f) => f.followingId);
            query._id = { $in: perIds };
        }
        if ((user === null || user === void 0 ? void 0 : user._id) && req.followed === 'false') {
            const follows = await this.followService.find({
                followerId: user._id
            });
            const perIds = follows.map((f) => f.followingId);
            query._id = { $nin: perIds };
        }
        let sort = {
            isOnline: -1,
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.sortBy === 'online') {
            sort = '-isOnline';
        }
        if (req.sortBy === 'live') {
            sort = '-live';
        }
        if (req.sortBy === 'latest') {
            sort = '-createdAt';
        }
        if (req.sortBy === 'oldest') {
            sort = 'createdAt';
        }
        if (req.sortBy === 'popular') {
            sort = '-score';
        }
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.performerModel.countDocuments(query)
        ]);
        const items = data.map((item) => new dtos_1.PerformerDto(item).toSearchResponse());
        let follows = [];
        if (user) {
            const performerIds = data.map((d) => d._id);
            follows = await this.followService.find({
                followerId: user._id,
                followingId: { $in: performerIds }
            });
        }
        items.forEach((performer) => {
            const followed = follows.find((f) => `${f.followingId}` === `${performer._id}`);
            performer.isFollowed = !!followed;
        });
        return {
            data: items,
            total
        };
    }
    async searchByKeyword(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                }
            ];
        }
        const [data] = await Promise.all([
            this.performerModel
                .find(query)
                .lean()
        ]);
        return data;
    }
    async topPerformers(req) {
        const query = {};
        query.status = 'active';
        if (req.gender) {
            query.gender = req.gender;
        }
        const sort = {
            score: -1,
            'stats.subscribers': -1,
            'stats.views': -1
        };
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.performerModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_1.PerformerDto(item).toSearchResponse()),
            total
        };
    }
    async randomSearch(req, user) {
        const query = {
            status: constants_1.PERFORMER_STATUSES.ACTIVE,
            verifiedDocument: true
        };
        if (req.gender) {
            query.gender = req.gender;
        }
        if (req.country) {
            query.country = { $regex: req.country };
        }
        if (req.isFreeSubscription) {
            if (typeof req.isFreeSubscription === 'string') {
                query.isFreeSubscription = req.isFreeSubscription === 'true';
            }
            else {
                query.isFreeSubscription = req.isFreeSubscription;
            }
        }
        if (req.isFeatured) {
            query.isFeatured = req.isFeatured === 'true';
        }
        const data = await this.performerModel.aggregate([
            { $match: query },
            { $sample: { size: 50 } }
        ]);
        const items = data.map((item) => new dtos_1.PerformerDto(item).toSearchResponse());
        let follows = [];
        if (user) {
            const performerIds = data.map((d) => d._id);
            follows = await this.followService.find({
                followerId: user._id,
                followingId: { $in: performerIds }
            });
        }
        items.forEach((performer) => {
            const followed = follows.find((f) => `${f.followingId}` === `${performer._id}`);
            performer.isFollowed = !!followed;
        });
        return {
            data: items
        };
    }
};
PerformerSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(1, (0, common_1.Inject)(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [follow_service_1.FollowService,
        mongoose_1.Model])
], PerformerSearchService);
exports.PerformerSearchService = PerformerSearchService;
//# sourceMappingURL=performer-search.service.js.map