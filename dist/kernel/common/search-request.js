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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRequest = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SearchRequest {
    constructor() {
        this.q = '';
        this.limit = 10;
        this.offset = 0;
        this.sortBy = 'updatedAt';
        this.sort = 'desc';
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SearchRequest.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return 10;
        if (value > 200)
            return 200;
        return value;
    }),
    __metadata("design:type", Number)
], SearchRequest.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value || value < 0)
            return 0;
        return value;
    }),
    __metadata("design:type", Number)
], SearchRequest.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SearchRequest.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value !== 'asc')
            return 'desc';
        return 'asc';
    }),
    __metadata("design:type", Object)
], SearchRequest.prototype, "sort", void 0);
exports.SearchRequest = SearchRequest;
//# sourceMappingURL=search-request.js.map