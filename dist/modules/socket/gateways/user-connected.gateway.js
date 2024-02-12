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
exports.WsUserConnectedGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const services_1 = require("../../auth/services");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const constant_1 = require("../../stream/constant");
const socket_user_service_1 = require("../services/socket-user.service");
const constants_1 = require("../constants");
let WsUserConnectedGateway = class WsUserConnectedGateway {
    constructor(queueEventService, socketUserService, authService) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.authService = authService;
    }
    async handleConnection(client) {
        if (!client.handshake.query.token) {
            return;
        }
        await this.login(client, client.handshake.query.token);
    }
    async handleDisconnect(client) {
        if (!client.handshake.query.token) {
            return;
        }
        await this.logout(client, client.handshake.query.token);
    }
    async handleLogin(client, payload) {
        if (!payload || !payload.token) {
            return;
        }
        await this.login(client, payload.token);
    }
    async handleLogout(client, payload) {
        if (!payload || !payload.token) {
            return;
        }
        await this.logout(client, payload.token);
    }
    async login(client, token) {
        const decodeded = await this.authService.verifySession(token);
        if (!decodeded) {
            return;
        }
        await this.socketUserService.addConnection(decodeded.sourceId, client.id);
        client.authUser = (0, lodash_1.pick)(decodeded, ['source', 'sourceId', 'authId']);
        if (decodeded.source === 'user') {
            await this.queueEventService.publish({
                channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                data: client.authUser
            });
        }
        if (decodeded.source === 'performer') {
            await this.queueEventService.publish({
                channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                data: client.authUser
            });
        }
    }
    async logout(client, token) {
        const decodeded = await this.authService.verifySession(token);
        if (!decodeded) {
            return;
        }
        if (!client.authUser) {
            return;
        }
        const connectionLen = await this.socketUserService.removeConnection(decodeded.sourceId, client.id);
        if (connectionLen) {
            return;
        }
        client.authUser = (0, lodash_1.pick)(decodeded, ['source', 'sourceId', 'authId']);
        if (decodeded.source === 'user') {
            await Promise.all([
                this.queueEventService.publish({
                    channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                    data: client.authUser
                }),
                this.queueEventService.publish({
                    channel: constant_1.MEMBER_LIVE_STREAM_CHANNEL,
                    eventName: constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED,
                    data: decodeded.sourceId
                })
            ]);
        }
        if (decodeded.source === 'performer') {
            await Promise.all([
                this.queueEventService.publish({
                    channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                    data: client.authUser
                }),
                this.queueEventService.publish({
                    channel: constant_1.MODEL_LIVE_STREAM_CHANNEL,
                    eventName: constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED,
                    data: decodeded.sourceId
                })
            ]);
        }
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('connect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('auth/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('auth/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleLogout", null);
WsUserConnectedGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => socket_user_service_1.SocketUserService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        services_1.AuthService])
], WsUserConnectedGateway);
exports.WsUserConnectedGateway = WsUserConnectedGateway;
//# sourceMappingURL=user-connected.gateway.js.map