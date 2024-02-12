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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../../auth/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../performer/dtos");
const lodash_1 = require("lodash");
const constants_2 = require("../../file/constants");
const services_3 = require("../../file/services");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
const constants_3 = require("../constants");
const exceptions_1 = require("../exceptions");
const username_existed_exception_1 = require("../exceptions/username-existed.exception");
let UserService = class UserService {
    constructor(authService, performerService, userModel, queueEventService, fileService) {
        this.authService = authService;
        this.performerService = performerService;
        this.userModel = userModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
    }
    async find(params) {
        return this.userModel.find(params);
    }
    async findOne(params) {
        return this.userModel.findOne(params);
    }
    async updateOne(query, params, options) {
        return this.userModel.updateOne(query, params, options);
    }
    async updateMany(query, params, options) {
        return this.userModel.updateMany(query, params, options);
    }
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        return this.userModel.findOne({ email: email.toLowerCase() });
    }
    async findById(id) {
        return this.userModel.findById(id);
    }
    async getMe(id, jwToken) {
        const user = await this.userModel.findById(id);
        if (user) {
            return new dtos_2.UserDto(user).toResponse(true);
        }
        const performer = await this.performerService.getDetails(id, jwToken);
        if (!performer && !user) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_1.PerformerDto(performer).toResponse(true);
    }
    async findByUsername(username) {
        const newUsername = username.trim().toLowerCase();
        const user = await this.userModel.findOne({ username: newUsername });
        return user ? new dtos_2.UserDto(user) : null;
    }
    async findByIds(ids) {
        const users = await this.userModel
            .find({ _id: { $in: ids } })
            .lean()
            .exec();
        return users.map((u) => new dtos_2.UserDto(u));
    }
    async checkExistedEmailorUsername(payload) {
        const data = payload.username
            ? await this.userModel.countDocuments({
                username: payload.username.trim().toLowerCase(),
            })
            : await this.userModel.countDocuments({
                email: payload.email.toLowerCase(),
            });
        return data;
    }
    async register(data) {
        if (!data || !data.email) {
            throw new kernel_1.EntityNotFoundException();
        }
        data.email = data.email.toLowerCase();
        const [countUserEmail, countPerformerEmail] = await Promise.all([
            this.userModel.countDocuments({
                email: data.email,
            }),
            this.performerService.checkExistedEmailorUsername({ email: data.email }),
        ]);
        if (countUserEmail || countPerformerEmail) {
            throw new exceptions_1.EmailHasBeenTakenException();
        }
        data.username = ((data === null || data === void 0 ? void 0 : data.username) || `user${kernel_1.StringHelper.randomString(12, "0123456789")}`)
            .trim()
            .toLowerCase();
        const [countUserUsername, countPerformerUsername] = await Promise.all([
            data.username && this.findByUsername(data.username),
            data.username &&
                this.performerService.checkExistedEmailorUsername({
                    username: data.username,
                }),
        ]);
        if (countUserUsername || countPerformerUsername) {
            throw new username_existed_exception_1.UsernameExistedException();
        }
        const user = Object.assign({}, data);
        user.balance = 0;
        user.createdAt = new Date();
        user.updatedAt = new Date();
        user.status = constants_3.STATUS_ACTIVE;
        user.roles = [constants_3.ROLE_USER];
        if (!user.name) {
            user.name = [user.firstName || "", user.lastName || ""].join(" ");
        }
        return this.userModel.create(user);
    }
    async create(data) {
        if (!data || !data.email) {
            throw new kernel_1.EntityNotFoundException();
        }
        data.email = data.email.toLowerCase();
        const [countUserEmail, countPerformerEmail] = await Promise.all([
            this.userModel.countDocuments({
                email: data.email,
            }),
            this.performerService.checkExistedEmailorUsername({ email: data.email }),
        ]);
        if (countUserEmail || countPerformerEmail) {
            throw new exceptions_1.EmailHasBeenTakenException();
        }
        data.username = ((data === null || data === void 0 ? void 0 : data.username) || `user${kernel_1.StringHelper.randomString(12, "0123456789")}`)
            .trim()
            .toLowerCase();
        const [countUserUsername, countPerformerUsername] = await Promise.all([
            data.username && this.findByUsername(data.username),
            data.username &&
                this.performerService.checkExistedEmailorUsername({
                    username: data.username,
                }),
        ]);
        if (countUserUsername || countPerformerUsername) {
            throw new username_existed_exception_1.UsernameExistedException();
        }
        const user = Object.assign({}, data);
        user.createdAt = new Date();
        user.updatedAt = new Date();
        user.status = constants_3.STATUS_ACTIVE;
        if (!user.name) {
            user.name =
                user.firstName && user.lastName
                    ? [user.firstName || "", user.lastName || ""].join(" ")
                    : "Unknown";
        }
        const savedUser = await this.userModel.create(user);
        return savedUser;
    }
    async socialCreate(payload) {
        const data = (0, lodash_1.omit)(Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() }), ["balance", "roles"]);
        if (!data.name) {
            data.name =
                data.firstName && data.lastName
                    ? [data.firstName || "", data.lastName || ""].join(" ")
                    : "Unknown";
        }
        if (data.email) {
            data.email = data.email.toLowerCase();
            const [countUserEmail, countPerformerEmail] = await Promise.all([
                data.email &&
                    this.userModel.countDocuments({
                        email: data.email,
                    }),
                data.email &&
                    this.performerService.checkExistedEmailorUsername({
                        email: data.email,
                    }),
            ]);
            if (countUserEmail || countPerformerEmail) {
                data.email = null;
            }
        }
        data.username = ((data === null || data === void 0 ? void 0 : data.username) || `user${kernel_1.StringHelper.randomString(12, "0123456789")}`)
            .trim()
            .toLowerCase();
        const [countUserUsername, countPerformerUsername] = await Promise.all([
            this.findByUsername(data.username),
            this.performerService.checkExistedEmailorUsername({
                username: data.username,
            }),
        ]);
        if (countUserUsername || countPerformerUsername) {
            data.username = `user${kernel_1.StringHelper.randomString(12, "0123456789")}`;
        }
        data.roles = [constants_3.ROLE_USER];
        data.balance = 0;
        return this.userModel.create(data);
    }
    async update(id, payload, user) {
        const data = (0, lodash_1.omit)(Object.assign(Object.assign({}, payload), { updatedAt: new Date() }), ["balance", "roles"]);
        if (`${user._id}` !== `${id}`) {
            throw new common_1.ForbiddenException();
        }
        if (!data.name) {
            data.name =
                (data.firstName &&
                    data.lastName &&
                    [data.firstName || "", data.lastName || ""].join(" ")) ||
                    data.username ||
                    "Unknown";
        }
        if (data.username) {
            data.username = (data.username || "").trim().toLowerCase();
            if (data.username !== user.username) {
                const [countUserUsername, countPerformerUsername] = await Promise.all([
                    this.userModel.countDocuments({
                        username: data.username,
                        _id: { $ne: user._id },
                    }),
                    this.performerService.checkExistedEmailorUsername({
                        username: data.username,
                    }),
                ]);
                if (countUserUsername || countPerformerUsername) {
                    throw new username_existed_exception_1.UsernameExistedException();
                }
            }
        }
        if (data.email) {
            data.email = (data.email || "").toLowerCase();
            if (data.email !== user.email) {
                const [countUserEmail, countPerformerEmail] = await Promise.all([
                    this.userModel.countDocuments({
                        email: data.email,
                        _id: { $ne: user._id },
                    }),
                    this.performerService.checkExistedEmailorUsername({
                        email: data.email,
                    }),
                ]);
                if (countUserEmail || countPerformerEmail) {
                    throw new exceptions_1.EmailHasBeenTakenException();
                }
                data.verifiedEmail = false;
            }
        }
        await this.userModel.updateOne({ _id: id }, data);
        if (data.email && data.email !== user.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== user.email) {
                await this.authService.sendVerificationEmail({
                    _id: user._id,
                    email: data.email,
                });
                await this.authService.updateKey({
                    source: "user",
                    sourceId: user._id,
                    key: data.email,
                });
            }
        }
        return user;
    }
    async adminUpdate(id, payload) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (!data.name) {
            data.name =
                (data.firstName &&
                    data.lastName &&
                    [data.firstName || "", data.lastName || ""].join(" ")) ||
                    data.username ||
                    "Unknown";
        }
        if (data.username) {
            data.username = (data.username || "").trim().toLowerCase();
            if (data.username !== user.username) {
                const [countUserUsername, countPerformerUsername] = await Promise.all([
                    this.userModel.countDocuments({
                        username: data.username,
                        _id: { $ne: user._id },
                    }),
                    this.performerService.checkExistedEmailorUsername({
                        username: data.username,
                    }),
                ]);
                if (countUserUsername || countPerformerUsername) {
                    throw new username_existed_exception_1.UsernameExistedException();
                }
            }
        }
        if (data.email) {
            data.email = (data.email || "").toLowerCase();
            if (data.email !== user.email) {
                const [countUserEmail, countPerformerEmail] = await Promise.all([
                    this.userModel.countDocuments({
                        email: data.email,
                        _id: { $ne: user._id },
                    }),
                    this.performerService.checkExistedEmailorUsername({
                        email: data.email,
                    }),
                ]);
                if (countUserEmail || countPerformerEmail) {
                    throw new exceptions_1.EmailHasBeenTakenException();
                }
                data.verifiedEmail = false;
            }
        }
        await this.userModel.updateOne({ _id: id }, data);
        const newUser = await this.userModel.findById(id);
        if (data.email && data.email !== user.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== user.email) {
                await this.authService.sendVerificationEmail({
                    _id: user._id,
                    email: data.email,
                });
                await this.authService.updateKey({
                    source: "user",
                    sourceId: user._id,
                    key: data.email,
                });
            }
        }
        return newUser;
    }
    async updateAvatar(user, file) {
        await this.userModel.updateOne({ _id: user._id }, {
            avatarId: file._id,
            avatarPath: file.path,
        });
        await this.fileService.addRef(file._id, {
            itemId: user._id,
            itemType: constants_2.REF_TYPE.USER,
        });
        if (user.avatarId && `${user.avatarId}` !== `${file._id}`) {
            await this.fileService.remove(user.avatarId);
        }
        return file;
    }
    async updateVerificationStatus(userId) {
        return this.userModel.updateOne({
            _id: userId,
        }, { status: constants_1.STATUS.ACTIVE, verifiedEmail: true, updatedAt: new Date() });
    }
    async updateStats(id, payload) {
        await this.userModel.updateOne({ _id: id }, { $inc: payload });
    }
    async updateCCbillPaymentInfo(userId, subscriptionId) {
        await this.userModel.updateOne({ _id: userId }, { ccbillCardToken: subscriptionId, authorisedCard: true });
    }
    async updateBalance(userId, num) {
        await this.userModel.updateOne({ _id: userId }, { $inc: { balance: num } });
    }
    async delete(id) {
        if (!kernel_1.StringHelper.isObjectId(id))
            throw new common_1.ForbiddenException();
        const user = await this.userModel.findById(id);
        if (!user)
            throw new kernel_1.EntityNotFoundException();
        await this.userModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.DELETE_USER_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_2.UserDto(user),
        }));
        return { deleted: true };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(2, (0, common_1.Inject)(providers_1.USER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_2.PerformerService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_3.FileService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map