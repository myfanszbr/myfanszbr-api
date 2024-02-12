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
exports.AgoraService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const agora_access_token_1 = require("agora-access-token");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
let AgoraService = class AgoraService {
    constructor(configService) {
        this.configService = configService;
    }
    buildTokenWithAccount(channelName, account, role = agora_access_token_1.RtcRole.PUBLISHER) {
        const appId = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.AGORA_APPID);
        const appCertificate = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.AGORA_CERTIFICATE);
        if (!appId || !appCertificate) {
            throw new common_1.BadRequestException();
        }
        const expirationTimeInSeconds = this.configService.get('agora').expirationTimeInSeconds || 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        return agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(appId, appCertificate, channelName, account, role, privilegeExpiredTs);
    }
};
AgoraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AgoraService);
exports.AgoraService = AgoraService;
//# sourceMappingURL=agora.service.js.map