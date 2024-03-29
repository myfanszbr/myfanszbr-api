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
exports.UserProductsController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../user/dtos");
const product_service_1 = require("../services/product.service");
const product_search_service_1 = require("../services/product-search.service");
const payloads_1 = require("../payloads");
let UserProductsController = class UserProductsController {
    constructor(authService, productService, productSearchService) {
        this.authService = authService;
        this.productService = productService;
        this.productSearchService = productSearchService;
    }
    async search(req) {
        const resp = await this.productSearchService.userSearch(req);
        const data = resp.data.map((d) => d.toPublic());
        return kernel_1.DataResponse.ok({
            total: resp.total,
            data
        });
    }
    async details(id, user) {
        const details = await this.productService.userGetDetails(id, user);
        return kernel_1.DataResponse.ok(details.toPublic());
    }
    async getDownloadLink(id, user, req) {
        const downloadLink = await this.productService.generateDownloadLink(id, user, req.jwToken);
        return kernel_1.DataResponse.ok({
            downloadLink
        });
    }
    async checkAuth(request) {
        if (!request.query.token)
            throw new common_1.ForbiddenException();
        const decodded = await this.authService.verifySession(request.query.token);
        if (!decodded)
            throw new common_1.ForbiddenException();
        const user = await this.authService.getSourceFromAuthSession({
            source: decodded.source,
            sourceId: decodded.sourceId
        });
        if (!user) {
            throw new common_1.ForbiddenException();
        }
        const valid = await this.productService.checkAuth(request, user);
        return kernel_1.DataResponse.ok(valid);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ProductSearchRequest]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "details", null);
__decorate([
    (0, common_1.Get)('/:id/download-link'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "getDownloadLink", null);
__decorate([
    (0, common_1.Get)('/auth/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "checkAuth", null);
UserProductsController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer-assets/products'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        product_service_1.ProductService,
        product_search_service_1.ProductSearchService])
], UserProductsController);
exports.UserProductsController = UserProductsController;
//# sourceMappingURL=user-product.controller.js.map