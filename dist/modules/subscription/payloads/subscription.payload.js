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
exports.SubscriptionUpdatePayload = exports.SubscriptionCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
class SubscriptionCreatePayload {
    constructor() {
        this.subscriptionType = constants_1.SUBSCRIPTION_TYPE.MONTHLY;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        constants_1.SUBSCRIPTION_TYPE.MONTHLY,
        constants_1.SUBSCRIPTION_TYPE.YEARLY,
        constants_1.SUBSCRIPTION_TYPE.FREE
    ]),
    __metadata("design:type", Object)
], SubscriptionCreatePayload.prototype, "subscriptionType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubscriptionCreatePayload.prototype, "performerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubscriptionCreatePayload.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubscriptionCreatePayload.prototype, "expiredAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubscriptionCreatePayload.prototype, "status", void 0);
exports.SubscriptionCreatePayload = SubscriptionCreatePayload;
class SubscriptionUpdatePayload {
    constructor() {
        this.subscriptionType = constants_1.SUBSCRIPTION_TYPE.MONTHLY;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        constants_1.SUBSCRIPTION_TYPE.MONTHLY,
        constants_1.SUBSCRIPTION_TYPE.YEARLY,
        constants_1.SUBSCRIPTION_TYPE.FREE
    ]),
    __metadata("design:type", Object)
], SubscriptionUpdatePayload.prototype, "subscriptionType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubscriptionUpdatePayload.prototype, "expiredAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubscriptionUpdatePayload.prototype, "status", void 0);
exports.SubscriptionUpdatePayload = SubscriptionUpdatePayload;
//# sourceMappingURL=subscription.payload.js.map