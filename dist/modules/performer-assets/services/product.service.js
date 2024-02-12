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
exports.ProductService = exports.PERFORMER_PRODUCT_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const services_2 = require("../../performer/services");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../reaction/constants");
const dtos_1 = require("../../performer/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_3 = require("../../token-transaction/services");
const constants_3 = require("../../token-transaction/constants");
const contants_1 = require("../../storage/contants");
const constants_4 = require("../constants");
const dtos_2 = require("../dtos");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
exports.PERFORMER_PRODUCT_CHANNEL = 'PERFORMER_PRODUCT_CHANNEL';
let ProductService = class ProductService {
    constructor(performerService, reactionService, tokenTransactionService, productModel, fileService, queueEventService) {
        this.performerService = performerService;
        this.reactionService = reactionService;
        this.tokenTransactionService = tokenTransactionService;
        this.productModel = productModel;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
    }
    async findByIds(ids) {
        const productIds = (0, lodash_1.uniq)(ids.map((i) => i.toString()));
        const products = await this.productModel
            .find({
            _id: {
                $in: productIds
            }
        })
            .lean()
            .exec();
        return products.map((p) => new dtos_2.ProductDto(p));
    }
    async findById(id) {
        const data = await this.productModel.findById(id);
        return data;
    }
    async create(payload, digitalFile, imageFile, creator) {
        if (payload.type === constants_4.PRODUCT_TYPE.DIGITAL && !digitalFile) {
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        const product = new this.productModel(payload);
        if (digitalFile)
            product.digitalFileId = digitalFile._id;
        if (imageFile)
            product.imageId = imageFile._id;
        if (creator) {
            if (!product.performerId) {
                product.performerId = creator._id;
            }
            product.createdBy = creator._id;
            product.updatedBy = creator._id;
        }
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.slug = kernel_1.StringHelper.createAlias(payload.name);
        const slugCheck = await this.productModel.countDocuments({
            slug: product.slug
        });
        if (slugCheck) {
            product.slug = `${product.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        await product.save();
        const dto = new dtos_2.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: dto
        }));
        return dto;
    }
    async update(id, payload, digitalFile, imageFile, updater) {
        const product = await this.productModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = product.status;
        if (payload.type === constants_4.PRODUCT_TYPE.DIGITAL
            && !product.digitalFileId && !digitalFile) {
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        let { slug } = product;
        if (payload.name !== product.name) {
            slug = kernel_1.StringHelper.createAlias(payload.name);
            const slugCheck = await this.productModel.countDocuments({
                slug,
                _id: { $ne: product._id }
            });
            if (slugCheck) {
                slug = `${slug}-${kernel_1.StringHelper.randomString(8)}`;
            }
        }
        (0, lodash_1.merge)(product, payload);
        const deletedFileIds = [];
        if (digitalFile) {
            product.digitalFileId && deletedFileIds.push(product.digitalFileId);
            product.digitalFileId = digitalFile._id;
        }
        if (imageFile) {
            product.imageId && deletedFileIds.push(product.imageId);
            product.imageId = imageFile._id;
        }
        if (updater)
            product.updatedBy = updater._id;
        product.updatedAt = new Date();
        product.slug = slug;
        await product.save();
        deletedFileIds.length
            && (await Promise.all(deletedFileIds.map((fileId) => this.fileService.remove(fileId))));
        const dto = new dtos_2.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async delete(id, user) {
        const product = await this.productModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.productModel.deleteOne({ _id: product._id });
        product.digitalFileId && (await this.fileService.remove(product.digitalFileId));
        product.imageId && (await this.fileService.remove(product.imageId));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: Object.assign(Object.assign({}, new dtos_2.ProductDto(product)), { user })
        }));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.DELETED_ASSETS_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_2.ProductDto(product)
        }));
        return true;
    }
    async getDetails(id, user, jwToken) {
        const query = (0, string_helper_1.isObjectId)(id) ? { _id: id } : { slug: id };
        const product = await this.productModel.findOne(query);
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [performer, image, digitalFile] = await Promise.all([
            this.performerService.findById(product.performerId),
            product.imageId ? this.fileService.findById(product.imageId) : null,
            product.digitalFileId ? this.fileService.findById(product.digitalFileId) : null
        ]);
        const bookmark = user && await this.reactionService.checkExisting(product._id, user._id, constants_2.REACTION.BOOKMARK, constants_2.REACTION_TYPE.PRODUCT);
        const dto = new dtos_2.ProductDto(product);
        dto.isBookMarked = !!bookmark;
        dto.image = image ? image.getUrl() : null;
        if (digitalFile) {
            const bought = await this.tokenTransactionService.checkBought(new dtos_2.ProductDto(product), constants_3.PurchaseItemType.PRODUCT, user);
            const canView = !!bought || (user && `${user._id}` === `${product.performerId}`) || (user && user.roles && user.roles.includes('admin'));
            let fileUrl = digitalFile.getUrl(canView);
            if (digitalFile.server !== contants_1.Storage.S3) {
                fileUrl = `${fileUrl}?productId=${product._id}&token=${jwToken}`;
            }
            dto.digitalFileUrl = fileUrl;
        }
        dto.performer = new dtos_1.PerformerDto(performer).toResponse();
        await this.productModel.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
        return dto;
    }
    async userGetDetails(id, user) {
        const query = (0, string_helper_1.isObjectId)(id) ? { _id: id } : { slug: id };
        const product = await this.productModel.findOne(query);
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [performer, image] = await Promise.all([
            this.performerService.findById(product.performerId),
            product.imageId ? this.fileService.findById(product.imageId) : null
        ]);
        const bookmark = user && await this.reactionService.checkExisting(product._id, user._id, constants_2.REACTION.BOOKMARK, constants_2.REACTION_TYPE.PRODUCT);
        const dto = new dtos_2.ProductDto(product);
        dto.isBookMarked = !!bookmark;
        dto.image = image ? image.getUrl() : null;
        dto.performer = new dtos_1.PerformerDto(performer).toResponse();
        await this.productModel.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
        return dto;
    }
    async updateStock(id, num = -1) {
        await this.productModel.updateOne({ _id: id }, { $inc: { stock: num } });
    }
    async updateCommentStats(id, num = 1) {
        await this.productModel.updateOne({ _id: id }, {
            $inc: { 'stats.comments': num }
        });
    }
    async updateLikeStats(id, num = 1) {
        await this.productModel.updateOne({ _id: id }, {
            $inc: { 'stats.likes': num }
        });
    }
    async updateBookmarkStats(id, num = 1) {
        await this.productModel.updateOne({ _id: id }, {
            $inc: { 'stats.bookmarks': num }
        });
    }
    async generateDownloadLink(productId, user, jwToken) {
        const query = (0, string_helper_1.isObjectId)(productId) ? { _id: productId } : { slug: productId };
        const product = await this.productModel.findOne(query);
        if (!product.digitalFileId)
            throw new kernel_1.EntityNotFoundException();
        const file = await this.fileService.findById(product.digitalFileId);
        if (!file)
            throw new kernel_1.EntityNotFoundException();
        const bought = await this.tokenTransactionService.checkBought(new dtos_2.ProductDto(product), constants_3.PurchaseItemType.PRODUCT, user);
        const canView = !!bought || (`${user._id}` === `${product.performerId}`) || (user && user.roles && user.roles.includes('admin'));
        let fileUrl = file.getUrl(canView);
        if (file.server !== contants_1.Storage.S3) {
            fileUrl = `${fileUrl}?productId=${product._id}&token=${jwToken}`;
        }
        return fileUrl;
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.productId) {
            throw new common_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const product = await this.productModel.findById(query.productId);
        if (!product)
            throw new kernel_1.EntityNotFoundException();
        if (user._id.toString() === product.performerId.toString()) {
            return true;
        }
        const bought = await this.tokenTransactionService.checkBought(new dtos_2.ProductDto(product), constants_3.PurchaseItemType.PRODUCT, user);
        if (!bought) {
            throw new common_1.ForbiddenException();
        }
        return true;
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => reaction_service_1.ReactionService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionService))),
    __param(3, (0, common_1.Inject)(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        reaction_service_1.ReactionService,
        services_3.TokenTransactionService,
        mongoose_1.Model,
        services_1.FileService,
        kernel_1.QueueEventService])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map