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
exports.PerformerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const file_1 = require("../../file");
const services_2 = require("../../auth/services");
const constants_2 = require("../../../kernel/constants");
const constants_3 = require("../../reaction/constants");
const constants_4 = require("../../file/constants");
const constants_5 = require("../constants");
const mailer_1 = require("../../mailer");
const services_3 = require("../../user/services");
const services_4 = require("../../block/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const contants_1 = require("../../storage/contants");
const follow_service_1 = require("../../follow/services/follow.service");
const moment = require("moment");
const lodash_1 = require("lodash");
const dtos_1 = require("../dtos");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
let PerformerService = class PerformerService {
    constructor(followService, performerBlockService, userService, authService, reactionService, settingService, fileService, subscriptionService, performerModel, queueEventService, mailService, paymentGatewaySettingModel, bankingSettingModel) {
        this.followService = followService;
        this.performerBlockService = performerBlockService;
        this.userService = userService;
        this.authService = authService;
        this.reactionService = reactionService;
        this.settingService = settingService;
        this.fileService = fileService;
        this.subscriptionService = subscriptionService;
        this.performerModel = performerModel;
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.paymentGatewaySettingModel = paymentGatewaySettingModel;
        this.bankingSettingModel = bankingSettingModel;
        this.queueEventService.subscribe('CONVERT_WELCOME_VIDEO_CHANNEL', 'FILE_PROCESSED_TOPIC', this.handleWelcomeVideoFile.bind(this));
    }
    async handleWelcomeVideoFile(event) {
        const { eventName } = event;
        if (eventName !== services_1.FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }
        const { performerId } = event.data.meta;
        const [performer, file] = await Promise.all([
            this.performerModel.findById(performerId),
            this.fileService.findById(event.data.fileId)
        ]);
        if (!performer) {
            await this.fileService.remove(event.data.fileId);
            return;
        }
        performer.welcomeVideoPath = file.getUrl();
        await performer.save();
    }
    async checkExistedEmailorUsername(payload) {
        const data = payload.username ? await this.performerModel.countDocuments({ username: payload.username.trim().toLowerCase() })
            : await this.performerModel.countDocuments({ email: payload.email.toLowerCase() });
        return data;
    }
    async findById(id) {
        const model = await this.performerModel.findById(id);
        if (!model)
            return null;
        return new dtos_1.PerformerDto(model);
    }
    async findOne(query) {
        const data = await this.performerModel.findOne(query);
        return data;
    }
    async find(query) {
        const data = await this.performerModel.find(query);
        return data;
    }
    async updateOne(query, params, options) {
        return this.performerModel.updateOne(query, params, options);
    }
    async findByUsername(username, countryCode, user) {
        const query = !(0, string_helper_1.isObjectId)(username) ? {
            username: username.trim()
        } : { _id: username };
        const model = await this.performerModel.findOne(query).lean();
        if (!model)
            throw new kernel_1.EntityNotFoundException();
        let isBlocked = false;
        if (countryCode && `${user === null || user === void 0 ? void 0 : user._id}` !== `${model._id}`) {
            isBlocked = await this.performerBlockService.checkBlockedCountryByIp(model._id, countryCode);
            if (isBlocked) {
                throw new common_1.HttpException('Your country has been blocked by this model', 403);
            }
        }
        const dto = new dtos_1.PerformerDto(model);
        let isBlockedByPerformer = false;
        let isBookMarked = null;
        let isSubscribed = null;
        let isFollowed = null;
        if (user) {
            isBlockedByPerformer = `${user === null || user === void 0 ? void 0 : user._id}` !== `${model._id}` && await this.performerBlockService.checkBlockedByPerformer(model._id, user._id);
            if (isBlockedByPerformer)
                throw new common_1.HttpException('You has been blocked by this model', 403);
            isBookMarked = await this.reactionService.findOneQuery({
                objectType: constants_3.REACTION_TYPE.PERFORMER, objectId: model._id, createdBy: user._id, action: constants_3.REACTION.BOOKMARK
            });
            const [subscription, following] = await Promise.all([
                this.subscriptionService.findOneSubscription({
                    performerId: model._id,
                    userId: user._id
                }),
                this.followService.findOne({ followerId: user._id, followingId: model._id })
            ]);
            if (subscription) {
                isSubscribed = moment().isBefore(subscription.expiredAt);
                if (subscription.usedFreeSubscription) {
                    dto.isFreeSubscription = false;
                }
            }
            isFollowed = following;
            isSubscribed = (subscription && moment().isBefore(subscription.expiredAt)) || false;
        }
        dto.isSubscribed = !!isSubscribed;
        dto.isBookMarked = !!isBookMarked;
        dto.isFollowed = !!isFollowed;
        if (user && user.roles && user.roles.includes('admin')) {
            dto.isSubscribed = true;
        }
        if (model.welcomeVideoId) {
            const welcomeVideo = await this.fileService.findById(model.welcomeVideoId);
            dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : '';
            dto.welcomeVideoPath && await this.performerModel.updateOne({ _id: model._id }, { welcomeVideoPath: dto.welcomeVideoPath });
        }
        await this.increaseViewStats(dto._id);
        return dto;
    }
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const model = await this.performerModel.findOne({
            email: email.toLowerCase()
        });
        if (!model)
            return null;
        return new dtos_1.PerformerDto(model);
    }
    async findByIds(ids) {
        const performers = await this.performerModel
            .find({
            _id: {
                $in: ids
            }
        })
            .lean()
            .exec();
        return performers.map((p) => new dtos_1.PerformerDto(p));
    }
    async getDetails(id, jwToken) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [documentVerification, idVerification, welcomeVideo] = await Promise.all([
            performer.documentVerificationId && this.fileService.findById(performer.documentVerificationId),
            performer.idVerificationId && this.fileService.findById(performer.idVerificationId),
            performer.welcomeVideoId && this.fileService.findById(performer.welcomeVideoId)
        ]);
        const [paypalSetting, blockCountries, bankingInformation, ccbillSetting] = await Promise.all([
            this.paymentGatewaySettingModel.findOne({ performerId: id, key: 'paypal' }),
            this.performerBlockService.findOneBlockCountriesByQuery({ sourceId: id }),
            this.getBankInfo(performer._id),
            this.paymentGatewaySettingModel.findOne({ performerId: id, key: 'ccbill' })
        ]);
        const dto = new dtos_1.PerformerDto(performer);
        dto.avatar = dto.avatarPath ? file_1.FileDto.getPublicUrl(dto.avatarPath) : null;
        dto.cover = dto.coverPath ? file_1.FileDto.getPublicUrl(dto.coverPath) : null;
        dto.welcomeVideoName = welcomeVideo ? welcomeVideo.name : null;
        dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : null;
        if (idVerification) {
            let fileUrl = idVerification.getUrl(true);
            if (idVerification.server !== contants_1.Storage.S3) {
                fileUrl = `${fileUrl}?performerId=${performer._id}&token=${jwToken}`;
            }
            dto.idVerification = {
                _id: idVerification._id,
                url: fileUrl,
                mimeType: idVerification.mimeType
            };
        }
        if (documentVerification) {
            let fileUrl = documentVerification.getUrl(true);
            if (documentVerification.server !== contants_1.Storage.S3) {
                fileUrl = `${fileUrl}?performerId=${performer._id}&token=${jwToken}`;
            }
            dto.documentVerification = {
                _id: documentVerification._id,
                url: fileUrl,
                mimeType: documentVerification.mimeType
            };
        }
        dto.paypalSetting = paypalSetting;
        dto.blockCountries = blockCountries;
        dto.bankingInformation = bankingInformation;
        dto.ccbillSetting = ccbillSetting;
        return dto;
    }
    async delete(id) {
        if (!kernel_1.StringHelper.isObjectId(id))
            throw new kernel_1.ForbiddenException();
        const performer = await this.performerModel.findById(id);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        await this.performerModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.DELETE_PERFORMER_CHANNEL,
            eventName: constants_2.EVENT.DELETED,
            data: new dtos_1.PerformerDto(performer).toResponse()
        }));
        return { deleted: true };
    }
    async create(payload) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const countPerformerUsername = await this.performerModel.countDocuments({
            username: payload.username.trim().toLowerCase()
        });
        const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: payload.username });
        if (countPerformerUsername || countUserUsername) {
            throw new exceptions_1.UsernameExistedException();
        }
        const countPerformerEmail = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase()
        });
        const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: payload.email });
        if (countPerformerEmail || countUserEmail) {
            throw new exceptions_1.EmailExistedException();
        }
        data.username = data.username ? data.username.trim().toLowerCase() : `user${(0, string_helper_1.randomString)(8, '0123456789')}`;
        data.email = data.email.toLowerCase();
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (!data.name) {
            data.name = data.firstName && data.lastName ? [data.firstName, data.lastName].join(' ') : data.username;
        }
        data.commissionPercentage = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.PERFORMER_COMMISSION);
        const performer = await this.performerModel.create(data);
        return new dtos_1.PerformerDto(performer);
    }
    async register(payload) {
        const data = (0, lodash_1.omit)(Object.assign(Object.assign({}, payload), { status: constants_5.PERFORMER_STATUSES.ACTIVE, updatedAt: new Date(), createdAt: new Date() }), ['balance', 'commissionPercentage']);
        const countPerformerUsername = await this.performerModel.countDocuments({
            username: payload.username.trim().toLowerCase()
        });
        const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: payload.username });
        if (countPerformerUsername || countUserUsername) {
            throw new exceptions_1.UsernameExistedException();
        }
        const countPerformerEmail = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase()
        });
        const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: payload.email });
        if (countPerformerEmail || countUserEmail) {
            throw new exceptions_1.EmailExistedException();
        }
        data.username = data.username ? data.username.trim().toLowerCase() : `model${(0, string_helper_1.randomString)(8, '0123456789')}`;
        data.email = data.email.toLowerCase();
        if (!data.name) {
            data.name = data.firstName && data.lastName ? [data.firstName, data.lastName].join(' ') : 'No_display_name';
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        data.commissionPercentage = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.PERFORMER_COMMISSION);
        const performer = await this.performerModel.create(data);
        await Promise.all([
            payload.idVerificationId
                && this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: constants_4.REF_TYPE.PERFORMER
                }),
            payload.documentVerificationId
                && this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: constants_4.REF_TYPE.PERFORMER
                })
        ]);
        const adminEmail = await settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.ADMIN_EMAIL);
        adminEmail && await this.mailService.send({
            subject: 'New performer sign up',
            to: adminEmail,
            data: { performer },
            template: 'new-performer-notify-admin'
        });
        return new dtos_1.PerformerDto(performer);
    }
    async adminUpdate(id, payload) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== performer.email) {
                const [emailCheck, countUserEmail] = await Promise.all([
                    this.performerModel.countDocuments({
                        email: data.email,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({ email: data.email })
                ]);
                if (emailCheck || countUserEmail) {
                    throw new exceptions_1.EmailExistedException();
                }
            }
        }
        if (data.username) {
            data.username = data.username.trim().toLowerCase();
            if (data.username !== performer.username) {
                const [usernameCheck, countUserUsername] = await Promise.all([
                    this.performerModel.countDocuments({
                        username: data.username,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({ username: data.username })
                ]);
                if (usernameCheck || countUserUsername) {
                    throw new exceptions_1.UsernameExistedException();
                }
            }
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(performer._id);
        const oldStatus = performer.status;
        const oldVerifiedDocument = performer.verifiedDocument;
        if (oldVerifiedDocument !== newPerformer.verifiedDocument && newPerformer.verifiedDocument) {
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_5.PERFORMER_UPDATE_STATUS_CHANNEL,
                eventName: constants_2.EVENT.UPDATED,
                data: Object.assign(Object.assign({}, new dtos_1.PerformerDto(newPerformer)), { oldStatus })
            }));
        }
        if (newPerformer.email && performer.email !== newPerformer.email) {
            await this.authService.sendVerificationEmail(newPerformer);
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                key: newPerformer.email
            });
        }
        return new dtos_1.PerformerDto(newPerformer).toResponse(true);
    }
    async selfUpdate(id, payload) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = (0, lodash_1.omit)(payload, ['balance', 'commissionPercentage']);
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== performer.email) {
                const [emailCheck, countUserEmail] = await Promise.all([
                    this.performerModel.countDocuments({
                        email: data.email,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({ email: data.email })
                ]);
                if (emailCheck || countUserEmail) {
                    throw new exceptions_1.EmailExistedException();
                }
            }
        }
        if (data.username) {
            data.username = data.username.trim().toLowerCase();
            if (data.username !== performer.username) {
                const [usernameCheck, countUserUsername] = await Promise.all([
                    this.performerModel.countDocuments({
                        username: data.username,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({ username: data.username })
                ]);
                if (usernameCheck || countUserUsername) {
                    throw new exceptions_1.UsernameExistedException();
                }
            }
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(id);
        if (newPerformer.email && performer.email !== newPerformer.email) {
            await this.authService.sendVerificationEmail(newPerformer);
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                key: newPerformer.email
            });
        }
        return true;
    }
    async socialCreate(payload) {
        const data = (0, lodash_1.omit)(Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() }), ['balance', 'commissionPercentage']);
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (payload.username) {
            const [countPerformerUsername, countUserUsername] = await Promise.all([
                this.performerModel.countDocuments({
                    username: payload.username
                }),
                this.userService.checkExistedEmailorUsername({ username: payload.username })
            ]);
            if (countPerformerUsername || countUserUsername) {
                data.username = `model${kernel_1.StringHelper.randomString(8, '0123456789')}`;
            }
        }
        if (payload.email) {
            const [countPerformerEmail, countUserEmail] = await Promise.all([
                this.performerModel.countDocuments({
                    email: payload.email
                }),
                this.userService.checkExistedEmailorUsername({ email: payload.email })
            ]);
            if (countPerformerEmail || countUserEmail) {
                data.email = null;
                data.verifiedEmail = false;
            }
        }
        return this.performerModel.create(data);
    }
    async updateDocument(performerId, file, type) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        const data = type === 'idVerificationId' ? {
            idVerificationId: file._id
        } : {
            documentVerificationId: file._id
        };
        await this.performerModel.updateOne({ _id: performerId }, data);
        await this.fileService.addRef(file._id, {
            itemId: (0, string_helper_1.toObjectId)(performerId),
            itemType: constants_4.REF_TYPE.PERFORMER
        });
        if (type === 'idVerificationId' && performer.idVerificationId && `${performer.idVerificationId}` !== `${file._id}`) {
            await this.fileService.remove(performer.idVerificationId);
        }
        if (type === 'documentVerificationId' && performer.documentVerificationId && `${performer.documentVerificationId}` !== `${file._id}`) {
            await this.fileService.remove(performer.documentVerificationId);
        }
        return file;
    }
    async updateAvatar(performerId, file) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        await this.performerModel.updateOne({ _id: performerId }, {
            avatarId: file._id,
            avatarPath: file.path
        });
        await this.fileService.addRef(file._id, {
            itemId: (0, string_helper_1.toObjectId)(performerId),
            itemType: constants_4.REF_TYPE.PERFORMER
        });
        if (performer.avatarId && `${performer.avatarId}` !== `${file._id}`) {
            await this.fileService.remove(performer.avatarId);
        }
        return file;
    }
    async updateCover(performerId, file) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        await this.performerModel.updateOne({ _id: performerId }, {
            coverId: file._id,
            coverPath: file.path
        });
        await this.fileService.addRef(file._id, {
            itemId: (0, string_helper_1.toObjectId)(performerId),
            itemType: constants_4.REF_TYPE.PERFORMER
        });
        if (performer.coverId && `${performer.coverId}` !== `${file._id}`) {
            await this.fileService.remove(performer.coverId);
        }
        return file;
    }
    async updateWelcomeVideo(performerId, file) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        await this.performerModel.updateOne({ _id: performerId }, {
            welcomeVideoId: file._id,
            welcomeVideoPath: file.path
        });
        await this.fileService.addRef(file._id, {
            itemId: (0, string_helper_1.toObjectId)(performerId),
            itemType: constants_4.REF_TYPE.PERFORMER
        });
        if (performer.welcomeVideoId && `${performer.welcomeVideoId}` !== `${file._id}`) {
            await this.fileService.remove(performer.welcomeVideoId);
        }
        await this.fileService.queueProcessVideo(file._id, {
            publishChannel: 'CONVERT_WELCOME_VIDEO_CHANNEL',
            meta: {
                performerId
            }
        });
        return file;
    }
    async getBankInfo(performerId) {
        const data = await this.bankingSettingModel.findOne({
            performerId
        });
        return data;
    }
    async increaseViewStats(id) {
        await this.performerModel.updateOne({ _id: id }, {
            $inc: { 'stats.views': 1 }
        });
    }
    async updateLastStreamingTime(id, streamTime) {
        await this.performerModel.updateOne({ _id: id }, {
            $inc: { 'stats.totalStreamTime': streamTime },
            lastStreamingTime: new Date(),
            live: 0,
            streamingStatus: 'offline'
        });
    }
    async updateStats(id, payload) {
        await this.performerModel.updateOne({ _id: id }, { $inc: payload });
    }
    async goLive(id) {
        await this.performerModel.updateOne({ _id: id }, { $set: { live: 1 } });
    }
    async setStreamingStatus(id, streamingStatus) {
        await this.performerModel.updateOne({ _id: id }, { $set: { streamingStatus } });
    }
    async updatePaymentGateway(payload) {
        let item = await this.paymentGatewaySettingModel.findOne({
            key: payload.key,
            performerId: payload.performerId
        });
        if (!item) {
            item = new this.paymentGatewaySettingModel();
        }
        item.key = payload.key;
        item.performerId = payload.performerId;
        item.status = 'active';
        item.value = payload.value;
        return item.save();
    }
    async getPaymentSetting(performerId, service = 'ccbill') {
        return this.paymentGatewaySettingModel.findOne({
            key: service,
            performerId
        });
    }
    async updateSubscriptionStat(performerId, num = 1) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            return;
        const minimumVerificationNumber = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.PERFORMER_VERIFY_NUMBER) || 5;
        const verifiedAccount = num === 1 ? performer.stats.subscribers >= (minimumVerificationNumber - 1) : (performer.stats.subscribers - 1) < minimumVerificationNumber;
        await this.performerModel.updateOne({ _id: performerId }, {
            $inc: { 'stats.subscribers': num },
            verifiedAccount
        });
    }
    async updateLikeStat(performerId, num = 1) {
        await this.performerModel.updateOne({ _id: performerId }, {
            $inc: { 'stats.likes': num }
        });
    }
    async updateCommissionSetting(performerId, payload) {
        await this.performerModel.updateOne({ _id: performerId }, {
            commissionPercentage: payload.commissionPercentage
        });
    }
    async updateBankingSetting(performerId, payload, user) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        if ((user === null || user === void 0 ? void 0 : user.roles) && !(user === null || user === void 0 ? void 0 : user.roles.includes('admin')) && `${user._id}` !== `${performerId}`) {
            throw new common_1.HttpException('Permission denied', 403);
        }
        let item = await this.bankingSettingModel.findOne({
            performerId
        });
        if (!item) {
            item = new this.bankingSettingModel(payload);
        }
        item.performerId = performerId;
        item.firstName = payload.firstName;
        item.lastName = payload.lastName;
        item.SSN = payload.SSN;
        item.bankName = payload.bankName;
        item.bankAccount = payload.bankAccount;
        item.bankRouting = payload.bankRouting;
        item.bankSwiftCode = payload.bankSwiftCode;
        item.address = payload.address;
        item.city = payload.city;
        item.state = payload.state;
        item.country = payload.country;
        return item.save();
    }
    async updateVerificationStatus(userId) {
        return this.performerModel.updateOne({
            _id: userId
        }, { status: constants_2.STATUS.ACTIVE, verifiedEmail: true });
    }
    async updateEmailVerificationStatus(userId, verifiedEmail = true) {
        return this.performerModel.updateOne({
            _id: userId
        }, { verifiedEmail });
    }
    async updatePerformerBalance(performerId, tokens) {
        await this.performerModel.updateOne({ _id: performerId }, { $inc: { balance: tokens } });
    }
    async checkAuthDocument(req, user) {
        const { query } = req;
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        if (query.performerId === `${user._id}`)
            return true;
        throw new kernel_1.ForbiddenException();
    }
};
PerformerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.PerformerBlockService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.AuthService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => reaction_service_1.ReactionService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => settings_1.SettingService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.FileService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(8, (0, common_1.Inject)(providers_1.PERFORMER_MODEL_PROVIDER)),
    __param(11, (0, common_1.Inject)(providers_1.PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER)),
    __param(12, (0, common_1.Inject)(providers_1.PERFORMER_BANKING_SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [follow_service_1.FollowService,
        services_4.PerformerBlockService,
        services_3.UserService,
        services_2.AuthService,
        reaction_service_1.ReactionService,
        settings_1.SettingService,
        services_1.FileService,
        subscription_service_1.SubscriptionService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        mailer_1.MailerService,
        mongoose_1.Model,
        mongoose_1.Model])
], PerformerService);
exports.PerformerService = PerformerService;
//# sourceMappingURL=performer.service.js.map