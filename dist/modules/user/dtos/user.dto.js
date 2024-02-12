"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const lodash_1 = require("lodash");
const file_1 = require("../../file");
class UserDto {
    constructor(data) {
        this.roles = ["user"];
        data &&
            Object.assign(this, (0, lodash_1.pick)(data, [
                "_id",
                "name",
                "firstName",
                "lastName",
                "email",
                "phone",
                "roles",
                "avatarId",
                "avatarPath",
                "status",
                "username",
                "gender",
                "balance",
                "country",
                "verifiedEmail",
                "isOnline",
                "stats",
                "pay2m",
                "twitterConnected",
                "googleConnected",
                "isPerformer",
                "createdAt",
                "updatedAt",
            ]));
    }
    getName() {
        if (this.name)
            return this.name;
        return [this.firstName || "", this.lastName || ""].join(" ");
    }
    toResponse(includePrivateInfo = false, isAdmin = false) {
        const publicInfo = {
            _id: this._id,
            name: this.getName(),
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            username: this.username,
            isOnline: this.isOnline,
            stats: this.stats,
            isPerformer: false,
            country: this.country,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        const privateInfo = {
            twitterConnected: this.twitterConnected,
            googleConnected: this.googleConnected,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            status: this.status,
            gender: this.gender,
            balance: this.balance,
            roles: this.roles,
            verifiedEmail: this.verifiedEmail,
        };
        if (isAdmin) {
            return Object.assign(Object.assign({}, publicInfo), privateInfo);
        }
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map