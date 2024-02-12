"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ObjectCannelACL = exports.Storage = void 0;
var Storage;
(function (Storage) {
    Storage["DiskStorage"] = "diskStorage";
    Storage["MemoryStorage"] = "memoryStorage";
    Storage["S3"] = "s3";
})(Storage = exports.Storage || (exports.Storage = {}));
var S3ObjectCannelACL;
(function (S3ObjectCannelACL) {
    S3ObjectCannelACL["PublicRead"] = "public-read";
    S3ObjectCannelACL["AuthenticatedRead"] = "authenticated-read";
})(S3ObjectCannelACL = exports.S3ObjectCannelACL || (exports.S3ObjectCannelACL = {}));
//# sourceMappingURL=contants.js.map