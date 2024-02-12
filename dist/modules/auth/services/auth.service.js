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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const settings_1 = require("../../settings");
const kernel_1 = require("../../../kernel");
const mailer_1 = require("../../mailer");
const constants_1 = require("../../user/constants");
const constants_2 = require("../../settings/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const exceptions_1 = require("../exceptions");
const auth_provider_1 = require("../providers/auth.provider");
const dtos_3 = require("../dtos");
const { OAuth2Client } = require('google-auth-library');
const oauth = require('oauth');
let AuthService = class AuthService {
    constructor(performerService, userService, oAuthLoginModel, authModel, verificationModel, forgotModel, authSessionModel, mailService) {
        this.performerService = performerService;
        this.userService = userService;
        this.oAuthLoginModel = oAuthLoginModel;
        this.authModel = authModel;
        this.verificationModel = verificationModel;
        this.forgotModel = forgotModel;
        this.authSessionModel = authSessionModel;
        this.mailService = mailService;
    }
    generateSalt(byteSize = 16) {
        return crypto.randomBytes(byteSize).toString('base64');
    }
    encryptPassword(pw, salt) {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        return crypto.pbkdf2Sync(pw || '', salt, defaultIterations, defaultKeyLength, 'sha1').toString('base64');
    }
    async findOne(query) {
        const data = await this.authModel.findOne(query);
        return data;
    }
    async find(query) {
        const data = await this.authModel.find(query);
        return data;
    }
    async createAuthPassword(data) {
        const salt = this.generateSalt();
        const newVal = this.encryptPassword(data.value, salt);
        let auth = await this.authModel.findOne({
            sourceId: data.sourceId
        });
        if (!auth) {
            auth = new this.authModel({
                type: 'password',
                source: data.source,
                sourceId: data.sourceId
            });
        }
        auth.type = 'password';
        auth.salt = salt;
        auth.value = newVal;
        auth.key = data.key;
        return auth.save();
    }
    async updateAuthPassword(data) {
        const user = data.source === 'user'
            ? await this.userService.findById(data.sourceId)
            : await this.performerService.findById(data.sourceId);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.createAuthPassword({
            source: data.source,
            sourceId: data.sourceId,
            key: user.email || (user === null || user === void 0 ? void 0 : user.username),
            value: data.value
        });
    }
    async updateKey(data) {
        const auths = await this.authModel.find({
            source: data.source,
            sourceId: data.sourceId
        });
        await Promise.all(auths.map((auth) => {
            auth.key = data.key;
            return auth.save();
        }));
    }
    async findBySource(options) {
        return this.authModel.findOne(options);
    }
    verifyPassword(pw, auth) {
        if (!pw || !auth || !auth.salt) {
            return false;
        }
        const encryptPassword = this.encryptPassword(pw, auth.salt);
        return encryptPassword === auth.value;
    }
    async getSourceFromAuthSession(auth) {
        if (auth.source === 'user') {
            const user = await this.userService.findById(auth.sourceId);
            return new dtos_1.UserDto(user).toResponse(true);
        }
        if (auth.source === 'performer') {
            const user = await this.performerService.findById(auth.sourceId);
            return new dtos_2.PerformerDto(user).toResponse(true);
        }
        return null;
    }
    async getForgot(token) {
        return this.forgotModel.findOne({ token });
    }
    async removeForgot(id) {
        await this.forgotModel.deleteOne({ _id: id });
    }
    async forgot(auth, source) {
        const token = kernel_1.StringHelper.randomString(14);
        await this.forgotModel.create({
            token,
            source: auth.source,
            sourceId: source._id,
            authId: auth._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const forgotLink = new URL(`auth/password-change?token=${token}`, (0, kernel_1.getConfig)('app').baseUrl).href;
        await this.mailService.send({
            subject: 'Recover password',
            to: source.email,
            data: {
                forgotLink
            },
            template: 'forgot'
        });
        return true;
    }
    async loginTwitter(callbackUrl = '') {
        const twitterClientId = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID);
        const twitterLoginClientSecret = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET);
        const _twitterConsumerKey = twitterClientId || process.env.TWITTER_LOGIN_CLIENT_ID;
        const _twitterConsumerSecret = twitterLoginClientSecret || process.env.TWITTER_LOGIN_CLIENT_SECRET;
        const _twitterCallbackUrl = callbackUrl || process.env.SOCIAL_LOGIN_CALLBACK_URL || process.env.USER_URL;
        const consumer = new oauth.OAuth('https://twitter.com/oauth/request_token', 'https://twitter.com/oauth/access_token', _twitterConsumerKey, _twitterConsumerSecret, '1.0A', _twitterCallbackUrl, 'HMAC-SHA1');
        return new Promise((resolver, reject) => {
            try {
                consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
                    if (error) {
                        return reject(new exceptions_1.AuthErrorException());
                    }
                    return resolver({
                        url: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
                        oauthToken,
                        oauthTokenSecret
                    });
                });
            }
            catch (e) {
                reject(new exceptions_1.AuthErrorException());
            }
        });
    }
    async twitterLoginCallback(payload) {
        const { oauthToken, oauthTokenSecret, oauth_verifier, role, callbackUrl = null } = payload;
        const twitterClientId = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID);
        const twitterLoginClientSecret = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET);
        const _twitterConsumerKey = twitterClientId || process.env.TWITTER_LOGIN_CLIENT_ID;
        const _twitterConsumerSecret = twitterLoginClientSecret || process.env.TWITTER_LOGIN_CLIENT_SECRET;
        const _twitterCallbackUrl = callbackUrl || process.env.SOCIAL_LOGIN_CALLBACK_URL || process.env.USER_URL;
        const consumer = new oauth.OAuth('https://twitter.com/oauth/request_token', 'https://twitter.com/oauth/access_token', _twitterConsumerKey, _twitterConsumerSecret, '1.0A', _twitterCallbackUrl, 'HMAC-SHA1');
        const _this = this;
        return new Promise((resolver, reject) => {
            try {
                consumer.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauth_verifier, async (error, _oauthAccessToken, _oauthAccessTokenSecret, profile) => {
                    if (error) {
                        return reject(new common_1.HttpException((error === null || error === void 0 ? void 0 : error.message) || 'Twitter Authentication Error', 403));
                    }
                    if (!profile || !profile.user_id) {
                        return reject(new kernel_1.EntityNotFoundException());
                    }
                    const oauthModel = await _this.oAuthLoginModel.findOne({
                        provider: 'twitter',
                        'value.user_id': profile.user_id
                    });
                    if (oauthModel) {
                        const authUser = await this.findBySource({
                            source: role,
                            sourceId: oauthModel.sourceId
                        });
                        if (!authUser)
                            throw new exceptions_1.AuthErrorException();
                        const token = await this.updateAuthSession(role, oauthModel.sourceId);
                        return { token };
                    }
                    const data = {
                        username: profile.screen_name,
                        name: profile.screen_name,
                        status: constants_1.STATUS_ACTIVE,
                        gender: constants_1.GENDER_MALE,
                        twitterConnected: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    const newUser = role === 'performer' ? await _this.performerService.socialCreate(data)
                        : await _this.userService.socialCreate(data);
                    await _this.createAuthPassword(new dtos_3.AuthCreateDto({
                        source: role || 'user',
                        sourceId: newUser._id,
                        type: 'password',
                        key: profile.screen_name
                    }));
                    await _this.oAuthLoginModel.create({
                        source: role || 'user',
                        sourceId: newUser._id,
                        provider: 'twitter',
                        value: profile,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    const token = await this.updateAuthSession(role || 'user', newUser._id);
                    return resolver({ token });
                });
            }
            catch (e) {
                reject(new kernel_1.EntityNotFoundException());
            }
        });
    }
    async verifyLoginGoogle(payload) {
        const { tokenId, role } = payload;
        const googleLoginClientId = await settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.GOOGLE_LOGIN_CLIENT_ID);
        const _googleLoginClientId = googleLoginClientId || process.env.GOOGLE_LOGIN_CLIENT_ID;
        const client = new OAuth2Client(_googleLoginClientId);
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: _googleLoginClientId
        });
        const profile = ticket.payload;
        if (!profile.email || !profile.email_verified) {
            throw new exceptions_1.AuthErrorException();
        }
        const oauthModel = await this.oAuthLoginModel.findOne({
            provider: 'google',
            'value.email': profile.email
        });
        if (oauthModel) {
            const authUser = await this.findBySource({
                source: role,
                sourceId: oauthModel.sourceId
            });
            if (!authUser)
                throw new exceptions_1.AuthErrorException();
            const token = await this.updateAuthSession(role, oauthModel.sourceId);
            return { token };
        }
        const randomUsername = `user${kernel_1.StringHelper.randomString(8, '0123456789')}`;
        const data = {
            email: profile.email.toLowerCase(),
            firstName: (profile === null || profile === void 0 ? void 0 : profile.given_name) || '',
            lastName: profile.family_name,
            username: randomUsername,
            name: profile.name,
            avatarPath: profile.picture || null,
            verifiedEmail: true,
            status: constants_1.STATUS_ACTIVE,
            gender: constants_1.GENDER_MALE,
            googleConnected: true
        };
        const newUser = role === 'user' ? await this.userService.socialCreate(data) : await this.performerService.socialCreate(data);
        let newAuth = await this.authModel.findOne({
            type: 'password',
            sourceId: newUser._id
        });
        if (!newAuth) {
            newAuth = await this.createAuthPassword(new dtos_3.AuthCreateDto({
                source: role || 'user',
                sourceId: newUser._id,
                type: 'password',
                key: profile.email
            }));
        }
        const authData = await this.oAuthLoginModel.findOne({
            sourceId: newUser._id,
            provider: 'google',
            'value.email': profile.email
        });
        if (!authData) {
            await this.oAuthLoginModel.create({
                source: role || 'user',
                sourceId: newUser._id,
                provider: 'google',
                value: profile,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        const token = await this.updateAuthSession(role || 'user', newUser._id);
        return { token };
    }
    async sendVerificationEmail(source) {
        const verifications = await this.verificationModel.find({
            sourceId: source._id,
            value: source.email.toLowerCase()
        });
        const token = kernel_1.StringHelper.randomString(15);
        if (!verifications.length) {
            await this.verificationModel.create({
                sourceId: source._id,
                sourceType: 'user',
                value: source.email,
                token
            });
            await this.verificationModel.create({
                sourceId: source._id,
                sourceType: 'performer',
                value: source.email,
                token
            });
        }
        if (verifications.length) {
            const ids = verifications.map((v) => v._id);
            await this.verificationModel.updateMany({ _id: { $in: ids } }, { $set: { token, updatedAt: new Date() } });
        }
        const verificationLink = new URL(`auth/email-verification?token=${token}`, (0, kernel_1.getConfig)('app').baseUrl).href;
        const siteName = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.SITE_NAME) || process.env.DOMAIN;
        await this.mailService.send({
            to: source.email,
            subject: 'Verify your email address',
            data: {
                name: (source === null || source === void 0 ? void 0 : source.name) || (source === null || source === void 0 ? void 0 : source.username) || 'there',
                verificationLink,
                siteName
            },
            template: 'email-verification'
        });
    }
    async verifyEmail(token) {
        const verifications = await this.verificationModel.find({
            token
        });
        if (!verifications || !verifications.length) {
            throw new kernel_1.EntityNotFoundException();
        }
        await Promise.all(verifications.map(async (verification) => {
            verification.verified = true;
            verification.updatedAt = new Date();
            await verification.save();
            if (verification.sourceType === 'user') {
                await this.userService.updateVerificationStatus(verification.sourceId);
            }
            if (verification.sourceType === 'performer') {
                await this.performerService.updateVerificationStatus(verification.sourceId);
            }
        }));
    }
    async updateAuthSession(source, sourceId, expiresInSeconds = 60 * 60 * 24) {
        const session = await this.authSessionModel.findOne({
            sourceId
        });
        const expiryAt = moment().add(expiresInSeconds, 'seconds').toDate();
        if (session) {
            await this.authSessionModel.updateOne({
                _id: session._id
            }, {
                $set: {
                    expiryAt
                }
            });
            return session.token;
        }
        const token = (0, string_helper_1.randomString)(15);
        await this.authSessionModel.create({
            source,
            sourceId,
            token,
            expiryAt,
            createdAt: new Date()
        });
        return token;
    }
    async verifySession(token) {
        const session = await this.authSessionModel.findOne({ token }).lean();
        if (!session || moment().isAfter(new Date(session.expiryAt))) {
            return false;
        }
        return session;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(2, (0, common_1.Inject)(auth_provider_1.OAUTH_LOGIN_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(auth_provider_1.AUTH_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(auth_provider_1.VERIFICATION_MODEL_PROVIDER)),
    __param(5, (0, common_1.Inject)(auth_provider_1.FORGOT_MODEL_PROVIDER)),
    __param(6, (0, common_1.Inject)(auth_provider_1.AUTH_SESSION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mailer_1.MailerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map