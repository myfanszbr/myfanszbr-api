"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("./app");
const file = require("./file");
const email = require("./email");
const image = require("./image");
const s3 = require("./s3");
const agora = require("./agora");
exports.default = () => ({
    app,
    file,
    email,
    image,
    s3,
    agora
});
//# sourceMappingURL=index.js.map