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
exports.TokenTransactionService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const services_1 = require("../../performer-assets/services");
const services_2 = require("../../performer/services");
const constants_2 = require("../../performer-assets/constants");
const services_3 = require("../../feed/services");
const dtos_1 = require("../../feed/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_4 = require("../../stream/services");
const constant_1 = require("../../stream/constant");
const services_5 = require("../../message/services");
const constants_3 = require("../../message/constants");
const settings_1 = require("../../settings");
const constants_4 = require("../../settings/constants");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const providers_1 = require("../providers");
const constants_5 = require("../constants");
const exceptions_1 = require("../exceptions");
const dtos_2 = require("../dtos");
let TokenTransactionService = class TokenTransactionService {
    constructor(TokenPaymentModel, queueEventService, socketUserService, videoService, productService, galleryService, performerService, feedService, streamService, messageService) {
        this.TokenPaymentModel = TokenPaymentModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.videoService = videoService;
        this.productService = productService;
        this.galleryService = galleryService;
        this.performerService = performerService;
        this.feedService = feedService;
        this.streamService = streamService;
        this.messageService = messageService;
    }
    async findById(id) {
        return this.TokenPaymentModel.findById(id);
    }
    async checkBought(item, type, user) {
        if (!user)
            return false;
        if (`${user._id}` === `${item.performerId}`
            || `${user._id}` === `${item.fromSourceId}`) {
            return true;
        }
        const transaction = await this.TokenPaymentModel.findOne({
            type,
            targetId: item._id,
            sourceId: user._id,
            status: constants_5.PURCHASE_ITEM_STATUS.SUCCESS
        });
        return !!transaction;
    }
    async purchaseProduct(id, user, payload) {
        const product = await this.productService.findById(id);
        if (!product)
            throw new kernel_1.EntityNotFoundException();
        const quantity = payload.quantity || 1;
        const totalPrice = quantity * product.price;
        if (user.balance < totalPrice) {
            throw new exceptions_1.NotEnoughMoneyException();
        }
        if (product.type === constants_2.PRODUCT_TYPE.PHYSICAL && quantity > product.stock) {
            throw new exceptions_1.OverProductStockException();
        }
        const storeProducts = [
            {
                quantity,
                price: totalPrice,
                name: product.name,
                description: `purchase product ${product.name} x${quantity}`,
                productId: product._id,
                productType: product.type,
                performerId: product.performerId
            }
        ];
        const transaction = await this.createPaymentTokenProduct(storeProducts, totalPrice, user);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: Object.assign(Object.assign({}, new dtos_2.TokenTransactionDto(transaction)), { shippingInfo: payload })
        }));
        return transaction;
    }
    async createPaymentTokenProduct(products, totalPrice, user) {
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = totalPrice;
        paymentTransaction.source = constants_5.PURCHASE_ITEM_TARGET_SOURCE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_5.PURCHASE_ITEM_TARTGET_TYPE.PRODUCT;
        paymentTransaction.targetId = products[0] && products[0].productId;
        paymentTransaction.performerId = products[0] && products[0].performerId;
        paymentTransaction.type = constants_5.PURCHASE_ITEM_TYPE.PRODUCT;
        paymentTransaction.totalPrice = totalPrice;
        paymentTransaction.products = products;
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        return paymentTransaction.save();
    }
    async purchaseStream(streamId, user) {
        const stream = await this.streamService.findOne({ _id: streamId });
        if (stream.isFree) {
            return { success: true };
        }
        const performer = await this.performerService.findById(stream.performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        let purchaseItemType = '';
        switch (stream.type) {
            case constant_1.PUBLIC_CHAT:
                purchaseItemType = constants_5.PURCHASE_ITEM_TYPE.PUBLIC_CHAT;
                break;
            case constant_1.GROUP_CHAT:
                purchaseItemType = constants_5.PURCHASE_ITEM_TYPE.GROUP_CHAT;
                break;
            case constant_1.PRIVATE_CHAT:
                purchaseItemType = constants_5.PURCHASE_ITEM_TYPE.PRIVATE_CHAT;
                break;
            default:
                break;
        }
        if (user.balance < stream.price)
            throw new exceptions_1.NotEnoughMoneyException();
        const transaction = await this.createPaymentTokenStream(stream, purchaseItemType, performer, user);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_2.TokenTransactionDto(transaction)
        }));
        await this.socketUserService.emitToUsers(transaction.sourceId, 'token_transaction_success', { item: stream });
        return transaction;
    }
    async createPaymentTokenStream(stream, purchaseItemType, performer, user) {
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = stream.price;
        paymentTransaction.source = constants_5.PURCHASE_ITEM_TARGET_SOURCE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_5.PURCHASE_ITEM_TARTGET_TYPE.STREAM;
        paymentTransaction.targetId = stream._id;
        paymentTransaction.sessionId = stream.sessionId;
        paymentTransaction.performerId = stream.performerId;
        paymentTransaction.type = purchaseItemType;
        paymentTransaction.totalPrice = stream.price;
        paymentTransaction.products = [
            {
                name: `${purchaseItemType} ${(performer === null || performer === void 0 ? void 0 : performer.name)
                    || (performer === null || performer === void 0 ? void 0 : performer.username)
                    || 'N/A'}`,
                description: `${purchaseItemType} ${(performer === null || performer === void 0 ? void 0 : performer.name)
                    || (performer === null || performer === void 0 ? void 0 : performer.username)
                    || 'N/A'}`,
                price: stream.price,
                productId: stream._id,
                productType: constants_5.PURCHASE_ITEM_TARTGET_TYPE.STREAM,
                performerId: stream.performerId,
                quantity: 1
            }
        ];
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        return paymentTransaction.save();
    }
    async purchaseVideo(id, user) {
        const video = await this.videoService.findById(id);
        if (!video || (video && !video.isSale) || (video && !video.price)) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < video.price)
            throw new exceptions_1.NotEnoughMoneyException();
        const transaction = await this.createPaymentTokenVideo(video, user);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_2.TokenTransactionDto(transaction)
        }));
        await this.socketUserService.emitToUsers(transaction.sourceId, 'token_transaction_success', { item: video });
        return transaction;
    }
    async createPaymentTokenVideo(video, user) {
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = video.price;
        paymentTransaction.source = constants_5.PURCHASE_ITEM_TARGET_SOURCE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_5.PURCHASE_ITEM_TARTGET_TYPE.VIDEO;
        paymentTransaction.targetId = video._id;
        paymentTransaction.performerId = video.performerId;
        paymentTransaction.type = constants_5.PURCHASE_ITEM_TYPE.VIDEO;
        paymentTransaction.totalPrice = video.price;
        paymentTransaction.products = [
            {
                name: video.title,
                description: `purchase video ${video.title}`,
                price: video.price,
                productId: video._id,
                productType: constants_5.PURCHASE_ITEM_TARTGET_TYPE.VIDEO,
                performerId: video.performerId,
                quantity: 1
            }
        ];
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        return paymentTransaction.save();
    }
    async purchaseGallery(id, user) {
        const gallery = await this.galleryService.findById(id);
        if (!gallery || (gallery && !gallery.price)) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < gallery.price)
            throw new exceptions_1.NotEnoughMoneyException();
        const transaction = await this.createPaymentTokenPhotoGallery(gallery, user);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_2.TokenTransactionDto(transaction)
        }));
        await this.socketUserService.emitToUsers(transaction.sourceId, 'token_transaction_success', { item: gallery });
        return transaction;
    }
    async createPaymentTokenPhotoGallery(gallery, user) {
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = gallery.price;
        paymentTransaction.source = constants_5.PURCHASE_ITEM_TARGET_SOURCE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_5.PURCHASE_ITEM_TARTGET_TYPE.GALLERY;
        paymentTransaction.targetId = gallery._id;
        paymentTransaction.performerId = gallery.performerId;
        paymentTransaction.type = constants_5.PURCHASE_ITEM_TYPE.GALLERY;
        paymentTransaction.totalPrice = gallery.price;
        paymentTransaction.products = [
            {
                name: gallery.title,
                description: `purchase gallery ${gallery.title}`,
                price: gallery.price,
                productId: gallery._id,
                productType: constants_5.PURCHASE_ITEM_TARTGET_TYPE.GALLERY,
                performerId: gallery.performerId,
                quantity: 1
            }
        ];
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        return paymentTransaction.save();
    }
    async sendTips(user, performerId, payload) {
        const { price, conversationId, streamType, sessionId } = payload;
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!price || user.balance < price) {
            throw new exceptions_1.NotEnoughMoneyException();
        }
        const minTipPrice = settings_1.SettingService.getValueByKey(constants_4.SETTING_KEYS.MINIMUM_TIP_PRICE) || 1;
        const maxTipPrice = settings_1.SettingService.getValueByKey(constants_4.SETTING_KEYS.MAXIMUM_TIP_PRICE) || 1000;
        if (price < minTipPrice) {
            throw new common_1.HttpException(`Minimum tip amount is $${minTipPrice}`, 422);
        }
        if (price > maxTipPrice) {
            throw new common_1.HttpException(`Maximum tip amount is $${maxTipPrice}`, 422);
        }
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = price;
        paymentTransaction.totalPrice = price;
        paymentTransaction.source = 'user';
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = conversationId && streamType
            ? constants_5.PURCHASE_ITEM_TARTGET_TYPE.STREAM
            : constants_5.PURCHASE_ITEM_TARTGET_TYPE.PERFORMER;
        paymentTransaction.targetId = performer._id;
        paymentTransaction.performerId = performer._id;
        paymentTransaction.sessionId = sessionId;
        paymentTransaction.type = conversationId && streamType
            ? constants_5.PURCHASE_ITEM_TYPE.STREAM_TIP
            : constants_5.PURCHASE_ITEM_TYPE.TIP;
        paymentTransaction.products = [
            {
                name: `Tip to ${performer.name || performer.username || performer._id}`,
                description: `Tip $${price} to ${performer.name
                    || performer.username
                    || performer._id}`,
                price,
                productId: performer._id,
                productType: constants_5.PURCHASE_ITEM_TARTGET_TYPE.PERFORMER,
                performerId: performer._id,
                quantity: 1
            }
        ];
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        await paymentTransaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_2.TokenTransactionDto(paymentTransaction)
        }));
        if (conversationId && streamType) {
            await this.messageService.createStreamMessageFromConversation(conversationId, {
                type: constants_3.MESSAGE_TYPE.TIP,
                text: `${(user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)} tipped $${price.toFixed(2)}`,
                fileIds: []
            }, {
                source: paymentTransaction.source,
                sourceId: paymentTransaction.sourceId
            }, user);
        }
        return paymentTransaction;
    }
    async purchasePostFeed(id, user) {
        const feed = await this.feedService.findById(id);
        if (!feed || (feed && !feed.price)) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < feed.price)
            throw new exceptions_1.NotEnoughMoneyException();
        const transaction = await this.createPaymentTokenFeed(new dtos_1.FeedDto(feed), user);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_5.TOKEN_TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_2.TokenTransactionDto(transaction)
        }));
        await this.socketUserService.emitToUsers(transaction.sourceId, 'token_transaction_success', { item: new dtos_1.FeedDto(feed) });
        return transaction;
    }
    async createPaymentTokenFeed(feed, user) {
        const paymentTransaction = new this.TokenPaymentModel();
        paymentTransaction.originalPrice = feed.price;
        paymentTransaction.source = constants_5.PURCHASE_ITEM_TARGET_SOURCE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_5.PURCHASE_ITEM_TARTGET_TYPE.FEED;
        paymentTransaction.targetId = (0, string_helper_1.toObjectId)(feed._id);
        paymentTransaction.performerId = (0, string_helper_1.toObjectId)(feed.fromSourceId);
        paymentTransaction.type = constants_5.PURCHASE_ITEM_TYPE.FEED;
        paymentTransaction.totalPrice = feed.price;
        paymentTransaction.products = [
            {
                name: 'Purchase post feed',
                description: feed.text,
                price: feed.price,
                productId: (0, string_helper_1.toObjectId)(feed._id),
                productType: constants_5.PURCHASE_ITEM_TARTGET_TYPE.FEED,
                performerId: (0, string_helper_1.toObjectId)(feed.fromSourceId),
                quantity: 1
            }
        ];
        paymentTransaction.status = constants_5.PURCHASE_ITEM_STATUS.SUCCESS;
        return paymentTransaction.save();
    }
    findOne(filter) {
        return this.TokenPaymentModel.findOne(filter);
    }
};
TokenTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_1.PAYMENT_TOKEN_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.VideoService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.ProductService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.GalleryService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.FeedService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.StreamService))),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_5.MessageService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        services_1.VideoService,
        services_1.ProductService,
        services_1.GalleryService,
        services_2.PerformerService,
        services_3.FeedService,
        services_4.StreamService,
        services_5.MessageService])
], TokenTransactionService);
exports.TokenTransactionService = TokenTransactionService;
//# sourceMappingURL=token-transaction.service.js.map