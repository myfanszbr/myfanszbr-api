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
exports.ReportCreatePayload = exports.ReportSearchRequestPayload = void 0;
const common_1 = require("../../../kernel/common");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../constants");
class ReportSearchRequestPayload extends common_1.SearchRequest {
}
exports.ReportSearchRequestPayload = ReportSearchRequestPayload;
class ReportCreatePayload {
    constructor() {
        this.target = constants_1.REPORT_TARGET.FEED;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        constants_1.REPORT_TARGET.FEED,
        constants_1.REPORT_TARGET.COMMENT,
        constants_1.REPORT_TARGET.GALLERY,
        constants_1.REPORT_TARGET.VIDEO,
        constants_1.REPORT_TARGET.GALLERY,
        constants_1.REPORT_TARGET.PRODUCT
    ]),
    __metadata("design:type", Object)
], ReportCreatePayload.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreatePayload.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreatePayload.prototype, "performerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreatePayload.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportCreatePayload.prototype, "description", void 0);
exports.ReportCreatePayload = ReportCreatePayload;
//# sourceMappingURL=index.js.map