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
exports.RoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../services");
let RoleGuard = class RoleGuard {
    constructor(reflector, authService) {
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization || request.query.Authorization;
        if (!token)
            return false;
        const decodded = await this.authService.verifySession(token);
        if (!decodded) {
            return false;
        }
        const user = request.user || await this.authService.getSourceFromAuthSession({
            source: decodded.source,
            sourceId: decodded.sourceId
        });
        if (!user || user.status !== constants_1.STATUS.ACTIVE) {
            return false;
        }
        if (!request.user)
            request.user = user;
        request.authUser = request.authUser || decodded;
        if (!request.jwToken)
            request.jwToken = token;
        if (user.isPerformer && roles.includes('performer')) {
            return true;
        }
        const diff = (0, lodash_1.intersection)(user.roles, roles);
        return diff.length > 0;
    }
};
RoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        services_1.AuthService])
], RoleGuard);
exports.RoleGuard = RoleGuard;
//# sourceMappingURL=role.guard.js.map