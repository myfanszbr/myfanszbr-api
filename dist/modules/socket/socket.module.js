"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const kernel_1 = require("../../kernel");
const socket_user_service_1 = require("./services/socket-user.service");
const user_connected_gateway_1 = require("./gateways/user-connected.gateway");
const auth_module_1 = require("../auth/auth.module");
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.QueueModule,
            kernel_1.AgendaModule.register(),
            nestjs_redis_1.RedisModule.forRoot({
                closeClient: true,
                config: {
                    host: process.env.REDIS_HOST || '127.0.0.1',
                    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                    db: parseInt(process.env.REDIS_DB, 10) || 0,
                    password: process.env.REDIS_PASSWORD || undefined,
                    keyPrefix: process.env.REDIS_PREFIX || undefined
                }
            }),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule)
        ],
        providers: [
            socket_user_service_1.SocketUserService,
            user_connected_gateway_1.WsUserConnectedGateway
        ],
        controllers: [],
        exports: [
            socket_user_service_1.SocketUserService
        ]
    })
], SocketModule);
exports.SocketModule = SocketModule;
//# sourceMappingURL=socket.module.js.map