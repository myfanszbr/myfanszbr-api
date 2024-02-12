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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../reaction/constants");
const constants_3 = require("../../token-transaction/constants");
const constants_4 = require("../../file/constants");
const services_3 = require("../../token-transaction/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const contants_1 = require("../../storage/contants");
const follow_service_1 = require("../../follow/services/follow.service");
const services_4 = require("../../block/services");
const dtos_1 = require("../dtos");
const exceptions_1 = require("../exceptions");
const constants_5 = require("../constants");
const providers_1 = require("../providers");
let FeedService = class FeedService {
    constructor(followService, performerService, tokenTransactionSearchService, paymentTokenService, reactionService, subscriptionService, fileService, PollVoteModel, voteModel, scheduledStreamNotificationModel, feedModel, queueEventService, blockService) {
        this.followService = followService;
        this.performerService = performerService;
        this.tokenTransactionSearchService = tokenTransactionSearchService;
        this.paymentTokenService = paymentTokenService;
        this.reactionService = reactionService;
        this.subscriptionService = subscriptionService;
        this.fileService = fileService;
        this.PollVoteModel = PollVoteModel;
        this.voteModel = voteModel;
        this.scheduledStreamNotificationModel = scheduledStreamNotificationModel;
        this.feedModel = feedModel;
        this.queueEventService = queueEventService;
        this.blockService = blockService;
    }
    async find(query) {
        return this.feedModel.find(query);
    }
    async findById(id) {
        const data = await this.feedModel.findById(id);
        return data;
    }
    async findByIds(ids) {
        const data = await this.feedModel.find({ _id: { $in: ids } });
        return data;
    }
    async handleCommentStat(feedId, num = 1) {
        await this.feedModel.updateOne({ _id: feedId }, { $inc: { totalComment: num } });
    }
    async _validatePayload(payload) {
        if (!constants_5.FEED_TYPES.includes(payload.type)) {
            throw new exceptions_1.InvalidFeedTypeException();
        }
    }
    async populateFeedData(feeds, user, jwToken) {
        const performerIds = (0, lodash_1.uniq)(feeds.map((f) => f.fromSourceId.toString()));
        const feedIds = feeds.map((f) => f._id);
        const pollIds = (0, lodash_1.flattenDeep)([feeds.map((f) => [f.pollIds])]);
        const fileIds = (0, lodash_1.flattenDeep)([feeds.map((f) => [f.fileIds])]);
        feeds.forEach((f) => {
            if (f.thumbnailId)
                fileIds.push(f.thumbnailId);
            if (f.teaserId)
                fileIds.push(f.teaserId);
        });
        const [performers, files, actions, subscriptions, transactions, polls, follows] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : [],
            user && user._id ? this.reactionService.findByQuery({ objectId: { $in: feedIds }, createdBy: user._id }) : [],
            user && user._id ? this.subscriptionService.findSubscriptionList({
                userId: user._id,
                performerId: { $in: performerIds }
            }) : [],
            user && user._id ? this.tokenTransactionSearchService.findByQuery({
                sourceId: user._id,
                targetId: { $in: feedIds },
                target: constants_3.PURCHASE_ITEM_TARTGET_TYPE.FEED,
                status: constants_3.PURCHASE_ITEM_STATUS.SUCCESS
            }) : [],
            pollIds.length ? this.PollVoteModel.find({ _id: { $in: pollIds } }) : [],
            user && user._id ? this.followService.find({
                followerId: user._id,
                followingId: { $in: performerIds }
            }) : []
        ]);
        return feeds.map((f) => {
            const feed = new dtos_1.FeedDto(f);
            const like = actions.find((l) => l.objectId.toString() === f._id.toString() && l.action === constants_2.REACTION.LIKE);
            feed.isLiked = !!like;
            const bookmarked = actions.find((l) => l.objectId.toString() === f._id.toString() && l.action === constants_2.REACTION.BOOKMARK);
            feed.isBookMarked = !!bookmarked;
            const subscription = subscriptions.find((s) => `${s.performerId}` === `${f.fromSourceId}`);
            feed.isSubscribed = subscription && moment().isBefore(subscription.expiredAt);
            feed.isBought = !!transactions.find((transaction) => `${transaction.targetId}` === `${f._id}`);
            feed.isFollowed = !!follows.find((fol) => `${fol.followingId}` === `${f.fromSourceId}`);
            if (feed.isSale && !feed.price) {
                feed.isBought = true;
            }
            const feedFileStringIds = (f.fileIds || []).map((fileId) => fileId.toString());
            const feedPollStringIds = (f.pollIds || []).map((pollId) => pollId.toString());
            feed.polls = polls.filter((p) => feedPollStringIds.includes(p._id.toString()));
            const feedFiles = files.filter((file) => feedFileStringIds.includes(file._id.toString()));
            if ((user && user._id && `${user._id}` === `${f.fromSourceId}`)
                || (user && user.roles && user.roles.includes('admin'))) {
                feed.isSubscribed = true;
                feed.isBought = true;
            }
            let canView = (feed.isSale && feed.isBought) || (!feed.isSale && feed.isSubscribed) || (feed.isSale && !feed.price);
            if (feed.isSchedule && moment(feed.scheduleAt).isBefore(new Date())) {
                canView = false;
            }
            if (feedFiles.length) {
                feed.files = feedFiles.map((file) => {
                    let fileUrl = file.getUrl(canView);
                    if (file.server !== contants_1.Storage.S3) {
                        fileUrl = `${fileUrl}?feedId=${feed._id}&token=${jwToken}`;
                    }
                    return Object.assign(Object.assign({}, file.toResponse()), { thumbnails: file.getThumbnails(), url: fileUrl });
                });
            }
            if (feed.thumbnailId) {
                const thumbnail = files.find((file) => file._id.toString() === feed.thumbnailId.toString());
                feed.thumbnail = thumbnail && Object.assign(Object.assign({}, thumbnail.toResponse()), { thumbnails: thumbnail.getThumbnails(), url: thumbnail.getUrl() });
            }
            if (feed.teaserId) {
                const teaser = files.find((file) => file._id.toString() === feed.teaserId.toString());
                feed.teaser = teaser && Object.assign(Object.assign({}, teaser), { thumbnails: teaser.getThumbnails(), url: teaser.getUrl() });
            }
            const performer = performers.find((p) => p._id.toString() === f.fromSourceId.toString());
            if (performer) {
                feed.performer = performer.toPublicDetailsResponse();
                if (subscription && subscription.usedFreeSubscription) {
                    feed.performer.isFreeSubscription = false;
                }
            }
            return feed;
        });
    }
    async findOne(id, user, jwToken) {
        const query = (0, string_helper_1.isObjectId)(id) ? { _id: id } : { slug: id };
        const feed = await this.feedModel.findOne(query);
        if (!feed) {
            throw new kernel_1.EntityNotFoundException();
        }
        const newFeed = await this.populateFeedData([feed], user, jwToken);
        return new dtos_1.FeedDto(newFeed[0]);
    }
    async create(payload, user) {
        await this._validatePayload(payload);
        const fromSourceId = user.roles && user.roles.includes('admin') && payload.fromSourceId ? payload.fromSourceId : user._id;
        const performer = await this.performerService.findById(fromSourceId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        const data = Object.assign({}, payload);
        data.slug = `post-${new Date().getTime()}`;
        const slugCheck = await this.feedModel.countDocuments({
            slug: data.slug
        });
        if (slugCheck) {
            data.slug = `${data.slug}${new Date().getTime()}`;
        }
        const feed = await this.feedModel.create(Object.assign(Object.assign({}, data), { fromSource: 'performer', fromSourceId }));
        if (feed.fileIds && feed.fileIds.length) {
            await Promise.all(feed.fileIds.map((fileId) => this.fileService.addRef(fileId, {
                itemId: feed._id,
                itemType: constants_4.REF_TYPE.FEED
            })));
        }
        feed.teaserId && await this.fileService.addRef(feed.teaserId, {
            itemId: feed._id,
            itemType: constants_4.REF_TYPE.FEED
        });
        feed.thumbnailId && await this.fileService.addRef(feed.thumbnailId, {
            itemId: feed._id,
            itemType: constants_4.REF_TYPE.FEED
        });
        if (feed.status === constants_1.STATUS.ACTIVE) {
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_5.PERFORMER_FEED_CHANNEL,
                eventName: constants_1.EVENT.CREATED,
                data: new dtos_1.FeedDto(feed)
            }));
        }
        if (feed.type === constants_5.FEED_TYPE.SCHEDULED_STREAMING) {
            await this.scheduledStreamNotificationModel.create({
                feedId: feed._id,
                performerId: feed.fromSourceId,
                scheduledAt: feed.streamingScheduled,
                notified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        return feed;
    }
    async updateFeed(id, user, payload) {
        const feed = await this.feedModel.findById(id);
        if (!feed || ((!user.roles || !user.roles.includes('admin')) && feed.fromSourceId.toString() !== user._id.toString()))
            throw new kernel_1.EntityNotFoundException();
        const data = Object.assign({}, payload);
        data.updatedAt = new Date();
        if (!feed.slug) {
            data.slug = `post-${new Date().getTime()}`;
            const slugCheck = await this.feedModel.countDocuments({
                slug: data.slug,
                _id: { $ne: feed._id }
            });
            if (slugCheck) {
                data.slug = `${data.slug}${new Date().getTime()}`;
            }
        }
        const oldStatus = feed.status;
        await this.feedModel.updateOne({ _id: id }, data);
        const newFeed = await this.feedModel.findById(id);
        if (payload.fileIds && payload.fileIds.length) {
            const ids = feed.fileIds.map((_id) => _id.toString());
            const Ids = payload.fileIds.filter((_id) => !ids.includes(_id));
            const deleteIds = feed.fileIds.filter((_id) => !payload.fileIds.includes(_id.toString()));
            await Promise.all(Ids.map((fileId) => this.fileService.addRef(fileId, {
                itemId: feed._id,
                itemType: constants_4.REF_TYPE.FEED
            })));
            await Promise.all(deleteIds.map((_id) => this.fileService.remove(_id)));
        }
        if ((feed.thumbnailId && `${feed.thumbnailId}` !== `${data.thumbnailId}`) || (feed.thumbnailId && !data.thumbnailId)) {
            await this.fileService.remove(feed.thumbnailId);
        }
        if ((feed.teaserId && `${feed.teaserId}` !== `${data.teaserId}`) || (feed.teaserId && !data.teaserId)) {
            await this.fileService.remove(feed.teaserId);
        }
        if (newFeed.type === constants_5.FEED_TYPE.SCHEDULED_STREAMING) {
            await this.scheduledStreamNotificationModel.updateOne({
                feedId: newFeed._id
            }, {
                performerId: newFeed.fromSourceId,
                notified: false,
                scheduledAt: feed.streamingScheduled,
                updatedAt: new Date()
            }, {
                upsert: true
            });
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.PERFORMER_FEED_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, new dtos_1.FeedDto(newFeed)), { status: newFeed.status, oldStatus })
        }));
        return { updated: true };
    }
    async deleteFeed(id, user) {
        if (!(0, string_helper_1.isObjectId)(id))
            throw new kernel_1.EntityNotFoundException();
        const feed = await this.feedModel.findById(id);
        if (!feed) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.roles && !user.roles.includes('admin') && `${user._id}` !== `${feed.fromSourceId}`) {
            throw new common_1.HttpException('You don\'t have permission to remove this post', 403);
        }
        await this.feedModel.deleteOne({ _id: feed._id });
        await Promise.all([
            feed.thumbnailId && this.fileService.remove(feed.thumbnailId),
            feed.teaserId && this.fileService.remove(feed.teaserId)
        ]);
        await Promise.all(feed.fileIds.map((_id) => this.fileService.remove(_id)));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.PERFORMER_FEED_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: Object.assign(Object.assign({}, new dtos_1.FeedDto(feed)), { user })
        }));
        return { success: true };
    }
    async search(req, user, jwToken) {
        const query = {};
        if (!user.roles || !user.roles.includes('admin')) {
            query.fromSourceId = user._id;
        }
        if (user.roles && user.roles.includes('admin') && req.performerId) {
            query.fromSourceId = (0, string_helper_1.toObjectId)(req.performerId);
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [
                { text: searchValue }
            ];
        }
        const sort = {
            updatedAt: -1
        };
        const [data, total] = await Promise.all([
            this.feedModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.feedModel.countDocuments(query)
        ]);
        return {
            data: await this.populateFeedData(data, user, jwToken),
            total
        };
    }
    async userSearchFeeds(req, user, jwToken) {
        const query = {
            status: constants_1.STATUS.ACTIVE
        };
        if (user && !user.isPerformer && !req.performerId) {
            const blocks = await this.blockService.userSearch(user._id);
            const performerIds = (blocks === null || blocks === void 0 ? void 0 : blocks.length) > 0 ? blocks.map((b) => b.sourceId) : [];
            query.fromSourceId = { $nin: performerIds };
        }
        if (req.isHome === 'true') {
            const [subscriptions, follows] = await Promise.all([
                user ? this.subscriptionService.findSubscriptionList({
                    userId: user._id,
                    expiredAt: { $gt: new Date() }
                }) : [],
                user ? this.followService.find({ followerId: user._id }) : []
            ]);
            const subPerIds = subscriptions.map((s) => `${s.performerId}`);
            const folPerIds = follows.map((s) => `${s.followingId}`);
            const performerIds = (0, lodash_1.uniq)(subPerIds.concat(folPerIds));
            query.fromSourceId = { $in: performerIds };
            if ((user && user.isPerformer))
                delete query.fromSourceId;
        }
        if (req.performerId) {
            query.fromSourceId = (0, string_helper_1.toObjectId)(req.performerId);
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            const searchValue = { $regex: regexp };
            query.$or = [
                { text: searchValue }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const sort = {
            updatedAt: -1
        };
        const [data, total] = await Promise.all([
            this.feedModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.feedModel.countDocuments(query)
        ]);
        return {
            data: await this.populateFeedData(data, user, jwToken),
            total
        };
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.feedId) {
            throw new kernel_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const feed = await this.feedModel.findById(query.feedId);
        if (!feed)
            throw new kernel_1.EntityNotFoundException();
        if (user._id.toString() === feed.fromSourceId.toString()) {
            return true;
        }
        if (feed.isSchedule && moment(feed.scheduleAt).isBefore(new Date())) {
            throw new kernel_1.ForbiddenException();
        }
        let isSubscribed = false;
        if (!feed.isSale) {
            const subscribed = await this.subscriptionService.checkSubscribed(feed.fromSourceId, user._id);
            isSubscribed = !!subscribed;
            if (!isSubscribed) {
                throw new kernel_1.ForbiddenException();
            }
            return true;
        }
        if (feed.isSale) {
            if (!feed.price) {
                return true;
            }
            const bought = await this.paymentTokenService.checkBought(feed, constants_3.PurchaseItemType.FEED, user);
            if (!bought) {
                throw new kernel_1.ForbiddenException();
            }
            return true;
        }
        throw new kernel_1.ForbiddenException();
    }
    async createPoll(payload, user) {
        const poll = new this.PollVoteModel(Object.assign(Object.assign({}, payload), { createdBy: user.roles && user.roles.includes('admin') && payload.performerId ? payload.performerId : user._id, createdAt: new Date(), updatedAt: new Date() }));
        await poll.save();
        return new dtos_1.PollDto(poll);
    }
    async votePollFeed(pollId, user) {
        const poll = await this.PollVoteModel.findById(pollId);
        if (!poll || !poll.refId) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (moment().isAfter(poll.expiredAt)) {
            throw new exceptions_1.PollExpiredException();
        }
        const vote = await this.voteModel.findOne({
            targetSource: constants_5.POLL_TARGET_SOURCE.FEED,
            refId: poll.refId,
            fromSourceId: user._id
        });
        if (vote) {
            throw new exceptions_1.AlreadyVotedException();
        }
        const newVote = await this.voteModel.create({
            targetSource: constants_5.POLL_TARGET_SOURCE.FEED,
            targetId: pollId,
            refId: poll.refId,
            fromSource: 'user',
            fromSourceId: user._id
        });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.VOTE_FEED_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: newVote
        }));
        return { voted: true };
    }
};
FeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionSearchService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => reaction_service_1.ReactionService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.FileService))),
    __param(7, (0, common_1.Inject)(providers_1.POLL_PROVIDER)),
    __param(8, (0, common_1.Inject)(providers_1.VOTE_PROVIDER)),
    __param(9, (0, common_1.Inject)(providers_1.SCHEDULED_STREAM_NOTIFICATION_PROVIDER)),
    __param(10, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __metadata("design:paramtypes", [follow_service_1.FollowService,
        services_1.PerformerService,
        services_3.TokenTransactionSearchService,
        services_3.TokenTransactionService,
        reaction_service_1.ReactionService,
        subscription_service_1.SubscriptionService,
        services_2.FileService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_4.BlockService])
], FeedService);
exports.FeedService = FeedService;
//# sourceMappingURL=feed.service.js.map