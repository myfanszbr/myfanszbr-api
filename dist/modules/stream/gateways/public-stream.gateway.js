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
exports.PublicStreamWsGateway = exports.STREAM_EVENT = void 0;
const websockets_1 = require("@nestjs/websockets");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const services_1 = require("../../auth/services");
const services_2 = require("../services");
const constant_1 = require("../constant");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const moment = require("moment");
const services_3 = require("../../performer/services");
const services_4 = require("../../message/services");
const services_5 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const follow_service_1 = require("../../follow/services/follow.service");
const services_6 = require("../../mailer/services");
const lodash_1 = require("lodash");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const stream_provider_1 = require("../providers/stream.provider");
exports.STREAM_EVENT = {
    JOIN_BROADCASTER: 'join-broadcaster',
    MODEL_JOINED: 'model-joined',
    MODEL_LEFT: 'model-left',
    ROOM_INFORMATIOM_CHANGED: 'public-room-changed',
    LEAVE_ROOM: 'public-stream/leave',
    JOIN_ROOM: 'public-stream/join',
    GO_LIVE: 'public-stream/live',
    ADMIN_END_SESSION_STREAM: 'admin-end-session-stream'
};
let PublicStreamWsGateway = class PublicStreamWsGateway {
    constructor(followService, subscriptionService, userService, performerService, authService, conversationService, socketService, streamModel, streamService, mailService) {
        this.followService = followService;
        this.subscriptionService = subscriptionService;
        this.userService = userService;
        this.performerService = performerService;
        this.authService = authService;
        this.conversationService = conversationService;
        this.socketService = socketService;
        this.streamModel = streamModel;
        this.streamService = streamService;
        this.mailService = mailService;
    }
    async goLive(client, payload) {
        const { conversationId } = payload;
        if (!conversationId)
            return;
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation)
            return;
        const { token } = client.handshake.query;
        if (!token)
            return;
        const authUser = token && await this.authService.verifySession(token);
        const user = authUser && await this.authService.getSourceFromAuthSession({
            source: authUser.source,
            sourceId: authUser.sourceId
        });
        if (!user)
            return;
        const stream = await this.streamService.findOne({ _id: conversation.streamId });
        if (!stream)
            return;
        const roomName = this.streamService.getRoomName(conversation._id, conversation.type);
        this.socketService.emitToRoom(roomName, exports.STREAM_EVENT.JOIN_BROADCASTER, {
            performerId: user._id,
            conversationId
        });
        await Promise.all([
            this.performerService.goLive(user._id),
            this.streamModel.updateOne({ _id: conversation.streamId }, { $set: { isStreaming: 1 } })
        ]);
        const [subs, follows] = await Promise.all([
            this.subscriptionService.findSubscriptionList({
                performerId: user._id
            }),
            this.followService.find({
                followingId: user._id
            })
        ]);
        const suids = subs.map((s) => s.userId.toString());
        const fuids = follows.map((s) => s.followerId.toString());
        const users = await this.userService.find({ _id: (0, lodash_1.uniq)(suids.concat(fuids)) });
        const redirectLink = `${process.env.USER_URL}/streaming/${user.username}`;
        await users.reduce(async (cb, u) => {
            await cb;
            u.email && await this.mailService.send({
                subject: 'New live stream',
                to: u.email,
                data: {
                    redirectLink,
                    performerName: user.name || user.username
                },
                template: 'performer-live-notify-followers'
            });
        }, Promise.resolve());
        const adminEmail = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.ADMIN_EMAIL);
        adminEmail && await this.mailService.send({
            subject: 'New live stream',
            to: adminEmail,
            data: {
                redirectLink,
                performerName: user.name || user.username
            },
            template: 'performer-live-notify-admin'
        });
    }
    async handleJoinPublicRoom(client, payload) {
        const { token } = client.handshake.query;
        const { conversationId } = payload;
        if (!conversationId)
            return;
        const conversation = conversationId && await this.conversationService.findById(conversationId);
        if (!conversation)
            return;
        const { performerId, type } = conversation;
        const authUser = token && await this.authService.verifySession(token);
        let user = authUser && await this.performerService.findById(authUser === null || authUser === void 0 ? void 0 : authUser.sourceId);
        if (!user) {
            user = authUser && await this.userService.findById(authUser === null || authUser === void 0 ? void 0 : authUser.sourceId);
        }
        const roomName = this.streamService.getRoomName(conversationId, type);
        await client.join(roomName);
        let role = 'guest';
        if (user) {
            role = `${user._id}` === `${performerId}` ? 'model' : 'member';
        }
        if (role === 'model') {
            await this.performerService.setStreamingStatus(user._id, constant_1.PUBLIC_CHAT);
        }
        await this.socketService.addConnectionToRoom(roomName, user ? user._id : client.id, role);
        const connections = await this.socketService.getRoomUserConnections(roomName);
        const memberIds = [];
        Object.keys(connections).forEach((id) => {
            const value = connections[id].split(',');
            if (value[0] === 'member') {
                memberIds.push(id);
            }
        });
        if (memberIds.length && role === 'model') {
            await this.socketService.emitToUsers(memberIds, exports.STREAM_EVENT.MODEL_JOINED, { conversationId });
        }
        const members = (memberIds.length && await this.userService.findByIds(memberIds)) || [];
        const data = {
            conversationId,
            total: members.length,
            members: members.map((m) => new dtos_1.UserDto(m).toResponse())
        };
        await this.socketService.emitToRoom(roomName, exports.STREAM_EVENT.ROOM_INFORMATIOM_CHANGED, data);
        const stream = await this.streamService.findByPerformerId(performerId, {
            type: constant_1.PUBLIC_CHAT
        });
        if (!stream)
            return;
        if (role !== 'model') {
            await this.streamModel.updateOne({ _id: stream._id }, { $set: { $inc: { 'stats.members': 1 } } });
        }
        if (stream.isStreaming) {
            await this.socketService.emitToRoom(roomName, exports.STREAM_EVENT.JOIN_BROADCASTER, {
                performerId,
                conversationId
            });
        }
    }
    async handleLeavePublicRoom(client, payload) {
        const { token } = client.handshake.query;
        const { conversationId } = payload;
        if (!conversationId) {
            return;
        }
        const conversation = payload.conversationId && await this.conversationService.findById(conversationId);
        if (!conversation) {
            return;
        }
        const { performerId, type } = conversation;
        const authUser = token && await this.authService.verifySession(token);
        let user = authUser && await this.performerService.findById(authUser === null || authUser === void 0 ? void 0 : authUser.sourceId);
        if (!user) {
            user = authUser && await this.userService.findById(authUser === null || authUser === void 0 ? void 0 : authUser.sourceId);
        }
        const roomName = this.streamService.getRoomName(conversationId, type);
        await client.leave(roomName);
        const stream = await this.streamService.findByPerformerId(performerId, {
            type: constant_1.PUBLIC_CHAT
        });
        if (user) {
            const results = await this.socketService.getConnectionValue(roomName, user._id);
            if (results) {
                const values = results.split(',');
                const timeJoined = values[1] ? parseInt(values[1], 10) : null;
                const role = values[0];
                if (timeJoined) {
                    const streamTime = moment()
                        .toDate()
                        .getTime() - timeJoined;
                    if (role === 'model') {
                        await Promise.all([
                            this.performerService.updateLastStreamingTime(user._id, streamTime),
                            stream && stream.isStreaming && this.streamModel.updateOne({ _id: stream._id }, { $set: { lastStreamingTime: new Date(), isStreaming: 0, streamingTime: streamTime / 1000 } })
                        ]);
                    }
                    else if (role === 'member') {
                        await this.streamModel.updateOne({ _id: stream._id }, { $set: { $inc: { 'stats.members': -1 } } });
                    }
                }
            }
        }
        await this.socketService.removeConnectionFromRoom(roomName, user ? user._id : client.id);
        const connections = await this.socketService.getRoomUserConnections(roomName);
        const memberIds = [];
        Object.keys(connections).forEach((id) => {
            const value = connections[id].split(',');
            if (value[0] === 'member') {
                memberIds.push(id);
            }
        });
        const members = await this.userService.findByIds(memberIds);
        const data = {
            conversationId,
            total: members.length,
            members: members.map((m) => new dtos_1.UserDto(m).toResponse())
        };
        if (memberIds.length && user instanceof dtos_2.PerformerDto) {
            await this.socketService.emitToUsers(memberIds, exports.STREAM_EVENT.MODEL_LEFT, { conversationId, performerId });
        }
        await this.socketService.emitToRoom(roomName, exports.STREAM_EVENT.ROOM_INFORMATIOM_CHANGED, data);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.STREAM_EVENT.GO_LIVE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "goLive", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.STREAM_EVENT.JOIN_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "handleJoinPublicRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(exports.STREAM_EVENT.LEAVE_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "handleLeavePublicRoom", null);
PublicStreamWsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_5.UserService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.PerformerService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.ConversationService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => socket_user_service_1.SocketUserService))),
    __param(7, (0, common_1.Inject)(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [follow_service_1.FollowService,
        subscription_service_1.SubscriptionService,
        services_5.UserService,
        services_3.PerformerService,
        services_1.AuthService,
        services_4.ConversationService,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model,
        services_2.StreamService,
        services_6.MailerService])
], PublicStreamWsGateway);
exports.PublicStreamWsGateway = PublicStreamWsGateway;
//# sourceMappingURL=public-stream.gateway.js.map