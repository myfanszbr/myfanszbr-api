"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const file_controller_1 = require("./controllers/file.controller");
const services_1 = require("./services");
let FileModule = class FileModule {
};
FileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule)
        ],
        providers: [
            ...providers_1.fileProviders,
            services_1.FileService,
            services_1.ImageService,
            services_1.VideoFileService,
            services_1.AudioFileService
        ],
        controllers: [file_controller_1.FileController],
        exports: [
            ...providers_1.fileProviders,
            services_1.FileService
        ]
    })
], FileModule);
exports.FileModule = FileModule;
//# sourceMappingURL=file.module.js.map