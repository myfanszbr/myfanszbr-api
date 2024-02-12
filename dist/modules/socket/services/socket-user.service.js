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
exports.SocketUserService = exports.CONNECTED_ROOM_REDIS_KEY = exports.CONNECTED_USER_REDIS_KEY = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const lodash_1 = require("lodash");
const websockets_1 = require("@nestjs/websockets");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
exports.CONNECTED_USER_REDIS_KEY = 'connected_users';
exports.CONNECTED_ROOM_REDIS_KEY = 'user:';
const SCHEDULE_OFFLINE_SOCKETS = 'SCHEDULE_OFFLINE_SOCKETS';
let SocketUserService = class SocketUserService {
    constructor(agenda, queueEventService, redisService) {
        this.agenda = agenda;
        this.queueEventService = queueEventService;
        this.redisService = redisService;
        this.defineJobs();
    }
    async defineJobs() {
        const collection = this.agenda._collection;
        await collection.deleteMany({
            name: {
                $in: [SCHEDULE_OFFLINE_SOCKETS]
            }
        });
        this.agenda.define(SCHEDULE_OFFLINE_SOCKETS, {}, this.scheduleOfflineSockets.bind(this));
        this.agenda.schedule('5 seconds from now', SCHEDULE_OFFLINE_SOCKETS, {});
    }
    async scheduleOfflineSockets(job, done) {
        try {
            const redisClient = this.redisService.getClient();
            const onlineUserIds = await redisClient.smembers(exports.CONNECTED_USER_REDIS_KEY);
            await onlineUserIds.reduce(async (previousPromise, userId) => {
                await previousPromise;
                const socketIds = await redisClient.smembers(userId);
                const sockets = await this.server.fetchSockets();
                const connectedSockets = sockets.map((socket) => socket.id);
                let hasOnline = false;
                await socketIds.reduce(async (lP, socketId) => {
                    await lP;
                    if (connectedSockets.includes(socketId)) {
                        hasOnline = true;
                    }
                    else {
                        await redisClient.srem(userId, socketId);
                    }
                    return Promise.resolve();
                }, Promise.resolve());
                if (!hasOnline) {
                    await redisClient.srem(exports.CONNECTED_USER_REDIS_KEY, userId);
                    await this.queueEventService.publish({
                        channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                        eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                        data: {
                            source: 'user',
                            sourceId: userId
                        }
                    });
                    await this.queueEventService.publish({
                        channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                        eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                        data: {
                            source: 'performer',
                            sourceId: userId
                        }
                    });
                }
                return Promise.resolve();
            }, Promise.resolve());
        }
        finally {
            job.remove();
            this.agenda.schedule('1 minute from now', SCHEDULE_OFFLINE_SOCKETS, {});
            typeof done === 'function' && done();
        }
    }
    async addConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.sadd(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        await redisClient.sadd(sourceId.toString(), socketId);
    }
    async userGetAllConnectedRooms(id) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.smembers(exports.CONNECTED_ROOM_REDIS_KEY + id);
        return results;
    }
    async removeConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.srem(sourceId.toString(), socketId);
        const len = await redisClient.scard(sourceId.toString());
        if (!len) {
            await redisClient.srem(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        }
        return len;
    }
    async addConnectionToRoom(roomId, id, value) {
        const redisClient = this.redisService.getClient();
        await redisClient.hset(`room-${roomId}`, id, `${value},${new Date().getTime()}`);
        await redisClient.sadd(exports.CONNECTED_ROOM_REDIS_KEY + id, roomId);
    }
    async removeConnectionFromRoom(roomId, userId) {
        const redisClient = this.redisService.getClient();
        await redisClient.hdel(`room-${roomId}`, userId);
        await redisClient.srem(exports.CONNECTED_ROOM_REDIS_KEY + userId, roomId);
    }
    async getConnectionValue(roomId, id) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.hmget(`room-${roomId}`, ...[id]);
        return results[0];
    }
    async getRoomUserConnections(roomId) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.hgetall(`room-${roomId}`);
        return results;
    }
    async countRoomUserConnections(roomId) {
        const redisClient = this.redisService.getClient();
        const total = await redisClient.hlen(`room-${roomId}`);
        return total;
    }
    async emitToUsers(userIds, eventName, data) {
        const stringIds = (0, lodash_1.uniq)((Array.isArray(userIds) ? userIds : [userIds])).map((i) => i.toString());
        const redisClient = this.redisService.getClient();
        Promise.all(stringIds.map(async (userId) => {
            const socketIds = await redisClient.smembers(userId);
            (socketIds || []).forEach((socketId) => this.server.to(socketId).emit(eventName, data));
        }));
    }
    async emitToRoom(roomName, eventName, data) {
        this.server.to(roomName).emit(eventName, data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], SocketUserService.prototype, "server", void 0);
SocketUserService = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [kernel_1.AgendaService,
        kernel_1.QueueEventService,
        nestjs_redis_1.RedisService])
], SocketUserService);
exports.SocketUserService = SocketUserService;
//# sourceMappingURL=socket-user.service.js.map