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
exports.RecaptchaService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../settings/services");
const axios_1 = require("axios");
const constants_1 = require("../../settings/constants");
let RecaptchaService = class RecaptchaService {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async verifyGoogleRecaptcha(token) {
        try {
            const googleReCaptchaSecretKey = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.GOOGLE_RECAPTCHA_SECRET_KEY);
            const resp = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${googleReCaptchaSecretKey || process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`);
            return resp.data;
        }
        catch (e) {
            return { success: false };
        }
    }
};
RecaptchaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.SettingService])
], RecaptchaService);
exports.RecaptchaService = RecaptchaService;
//# sourceMappingURL=re-captcha.service.js.map