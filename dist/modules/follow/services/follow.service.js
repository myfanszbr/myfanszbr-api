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
exports.FollowService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const services_1 = require("../../user/services");
const mailer_1 = require("../../mailer");
const providers_1 = require("../providers");
const follow_dto_1 = require("../dtos/follow.dto");
const services_2 = require("../../performer/services");
let FollowService = class FollowService {
    constructor(performerService, userService, followModel, mailerService) {
        this.performerService = performerService;
        this.userService = userService;
        this.followModel = followModel;
        this.mailerService = mailerService;
    }
    async countOne(query) {
        return this.followModel.countDocuments(query);
    }
    async findOne(query) {
        return this.followModel.findOne(query);
    }
    async find(query) {
        return this.followModel.find(query);
    }
    async create(followingId, user) {
        let follow = await this.followModel.findOne({
            followerId: user._id,
            followingId
        });
        if (follow) {
            return new follow_dto_1.FollowDto(follow);
        }
        follow = await this.followModel.create({
            followerId: user._id,
            followingId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const [performer] = await Promise.all([
            this.performerService.findById(follow.followingId),
            this.performerService.updateStats(followingId, { 'stats.followers': 1 }),
            this.userService.updateStats(user._id, { 'stats.following': 1 })
        ]);
        (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
            subject: 'User follow/unfollow',
            to: performer === null || performer === void 0 ? void 0 : performer.email,
            data: {
                userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                action: 'followed'
            },
            template: 'performer-follow'
        });
        return new follow_dto_1.FollowDto(follow);
    }
    async remove(followingId, user) {
        const follow = await this.followModel.findOne({
            followerId: user._id,
            followingId
        });
        if (!follow) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.followModel.deleteOne({ _id: follow._id });
        const [performer] = await Promise.all([
            this.performerService.findById(follow.followingId),
            this.performerService.updateStats(followingId, { 'stats.followers': -1 }),
            this.userService.updateStats(user._id, { 'stats.following': -1 })
        ]);
        (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
            subject: 'User follow/unfollow',
            to: performer === null || performer === void 0 ? void 0 : performer.email,
            data: {
                userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                action: 'unfollowed'
            },
            template: 'performer-follow'
        });
        return true;
    }
    async search(req) {
        const query = {};
        if (req.followerId) {
            query.followerId = req.followerId;
        }
        if (req.followingId) {
            query.followingId = req.followingId;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.followModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.followModel.countDocuments(query)
        ]);
        const follows = data.map((d) => new follow_dto_1.FollowDto(d));
        const followerIds = (0, lodash_1.uniq)(data.map((d) => d.followerId));
        const followingIds = (0, lodash_1.uniq)(data.map((d) => d.followingId));
        const [users, performers] = await Promise.all([
            followerIds.length ? this.userService.findByIds(followerIds) : [],
            followingIds.length ? this.performerService.findByIds(followingIds) : []
        ]);
        follows.forEach((follow) => {
            const followerInfo = users.find((p) => `${p._id}` === `${follow.followerId}`);
            const followingInfo = performers.find((p) => `${p._id}` === `${follow.followingId}`);
            follow.followerInfo = followerInfo ? new dtos_2.UserDto(followerInfo).toResponse() : null;
            follow.followingInfo = followingInfo ? new dtos_1.PerformerDto(followingInfo).toResponse() : null;
        });
        return {
            data: follows,
            total
        };
    }
};
FollowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(2, (0, common_1.Inject)(providers_1.FOLLOW_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model,
        mailer_1.MailerService])
], FollowService);
exports.FollowService = FollowService;
//# sourceMappingURL=follow.service.js.map