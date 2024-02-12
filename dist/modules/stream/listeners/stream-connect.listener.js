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
exports.StreamConnectListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../constant");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const stream_provider_1 = require("../providers/stream.provider");
const USER_LIVE_STREAM_DISCONNECTED = 'USER_LIVE_STREAM_CONNECTED';
const MODEL_LIVE_STREAM_DISCONNECTED = 'MODEL_LIVE_STREAM_CONNECTED';
let StreamConnectListener = class StreamConnectListener {
    constructor(userService, performerService, streamModel, queueEventService, socketUserService) {
        this.userService = userService;
        this.performerService = performerService;
        this.streamModel = streamModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.queueEventService.subscribe(constant_1.MEMBER_LIVE_STREAM_CHANNEL, USER_LIVE_STREAM_DISCONNECTED, this.userDisconnectHandler.bind(this));
        this.queueEventService.subscribe(constant_1.MODEL_LIVE_STREAM_CHANNEL, MODEL_LIVE_STREAM_DISCONNECTED, this.modelDisconnectHandler.bind(this));
    }
    async userDisconnectHandler(event) {
        if (event.eventName !== constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED) {
            return;
        }
        const sourceId = event.data;
        const user = sourceId && await this.userService.findById(sourceId);
        if (!user) {
            return;
        }
        const connectedRedisRooms = await this.socketUserService.userGetAllConnectedRooms(sourceId);
        if (!connectedRedisRooms.length) {
            return;
        }
        await Promise.all(connectedRedisRooms.map((id) => this.socketUserService.removeConnectionFromRoom(id, sourceId)));
        const conversationIds = connectedRedisRooms.map((id) => this.deserializeConversationId(id));
        await Promise.all(connectedRedisRooms.map((id, index) => conversationIds[index]
            && this.socketUserService.emitToRoom(id, `message_created_conversation_${conversationIds[index]}`, {
                text: `${(user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || 'N/A'} left`,
                _id: conversationIds[index],
                conversationId: conversationIds[index],
                isSystem: true
            })));
    }
    async modelDisconnectHandler(event) {
        if (event.eventName !== constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED) {
            return;
        }
        const sourceId = event.data;
        const model = await this.performerService.findById(sourceId);
        if (!model) {
            return;
        }
        const connectedRedisRooms = await this.socketUserService.userGetAllConnectedRooms(sourceId);
        connectedRedisRooms.length > 0 && await connectedRedisRooms.map((r) => this.socketUserService.removeConnectionFromRoom(r, sourceId));
        await this.streamModel.updateMany({ performerId: model._id }, { $set: { isStreaming: 0, lastStreamingTime: new Date() } });
    }
    deserializeConversationId(str) {
        const strs = str.split('-');
        if (!strs.length)
            return '';
        return strs[strs.length - 1];
    }
};
StreamConnectListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.UserService,
        services_1.PerformerService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService])
], StreamConnectListener);
exports.StreamConnectListener = StreamConnectListener;
//# sourceMappingURL=stream-connect.listener.js.map