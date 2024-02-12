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
exports.StockProductListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../token-transaction/constants");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const constants_2 = require("../../../kernel/constants");
const services_2 = require("../../mailer/services");
const services_3 = require("../../performer/services");
const services_4 = require("../../auth/services");
const services_5 = require("../../user/services");
const constants_3 = require("../../order/constants");
const services_6 = require("../services");
const constants_4 = require("../constants");
const UPDATE_STOCK_TOPIC = 'UPDATE_STOCK_TOPIC';
let StockProductListener = class StockProductListener {
    constructor(authService, queueEventService, productService, mailService, fileService, performerService, userService) {
        this.authService = authService;
        this.queueEventService = queueEventService;
        this.productService = productService;
        this.mailService = mailService;
        this.fileService = fileService;
        this.performerService = performerService;
        this.userService = userService;
        this.queueEventService.subscribe(constants_1.TOKEN_TRANSACTION_SUCCESS_CHANNEL, UPDATE_STOCK_TOPIC, this.handleStockProducts.bind(this));
        this.queueEventService.subscribe(constants_3.REFUND_ORDER_CHANNEL, UPDATE_STOCK_TOPIC, this.handleRefundedOrder.bind(this));
    }
    async handleRefundedOrder(event) {
        if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const { productId, quantity } = event.data;
        const product = await this.productService.findById(productId);
        if (!product || product.type !== 'physical') {
            await this.productService.updateStock(product._id, quantity);
        }
    }
    async handleStockProducts(event) {
        if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
            return false;
        }
        const transaction = event.data;
        if (transaction.type !== constants_1.PURCHASE_ITEM_TYPE.PRODUCT || !transaction.products || !transaction.products.length) {
            return false;
        }
        const prodIds = transaction.products.map((p) => p.productId);
        const performer = await this.performerService.findById(transaction.performerId);
        const user = await this.userService.findById(transaction.sourceId);
        const products = await this.productService.findByIds(prodIds);
        products.reduce(async (cb, prod) => {
            await cb;
            if (prod.type === constants_4.PRODUCT_TYPE.PHYSICAL) {
                const p = transaction.products.find((produ) => `${produ.productId}` === `${prod._id}`);
                await this.productService.updateStock(prod._id, -(p.quantity || 1));
                await this.sendPhysicalProduct(prod, performer, user);
            }
            if (prod.type === constants_4.PRODUCT_TYPE.DIGITAL && prod.digitalFileId) {
                await this.sendDigitalProductLink(transaction, performer, user, prod.digitalFileId);
            }
        }, Promise.resolve());
        return true;
    }
    async sendDigitalProductLink(transaction, performer, user, fileId) {
        const auth = await this.authService.findBySource({ source: 'user', sourceId: transaction.sourceId });
        const token = auth && await this.authService.updateAuthSession('user', auth.sourceId);
        const file = await this.fileService.findById(fileId);
        if (file) {
            const digitalLink = token ? `${new file_1.FileDto(file).getUrl()}?productId=${transaction.targetId}&token=${token}` : new file_1.FileDto(file).getUrl();
            user && user.email && await this.mailService.send({
                subject: 'Digital file',
                to: user.email,
                data: {
                    performer,
                    user,
                    transaction,
                    digitalLink
                },
                template: 'send-user-digital-product'
            });
        }
    }
    async sendPhysicalProduct(product, performer, user) {
        performer.email && await this.mailService.send({
            subject: 'Product has been ordered',
            to: performer.email,
            data: {
                userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                productName: product === null || product === void 0 ? void 0 : product.name,
                productDescription: product === null || product === void 0 ? void 0 : product.description
            },
            template: 'performer-physical-product'
        });
    }
};
StockProductListener = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.PerformerService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_5.UserService))),
    __metadata("design:paramtypes", [services_4.AuthService,
        kernel_1.QueueEventService,
        services_6.ProductService,
        services_2.MailerService,
        services_1.FileService,
        services_3.PerformerService,
        services_5.UserService])
], StockProductListener);
exports.StockProductListener = StockProductListener;
//# sourceMappingURL=stock-product.listener.js.map