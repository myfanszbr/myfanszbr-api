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
exports.DeleteAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../performer-assets/constants");
const providers_1 = require("../providers");
const DELETE_ASSETS_REPORT_TOPIC = 'DELETE_ASSETS_REPORT_TOPIC';
let DeleteAssetsListener = class DeleteAssetsListener {
    constructor(queueEventService, reportModel) {
        this.queueEventService = queueEventService;
        this.reportModel = reportModel;
        this.queueEventService.subscribe(constants_2.DELETED_ASSETS_CHANNEL, DELETE_ASSETS_REPORT_TOPIC, this.handleDeleteData.bind(this));
    }
    async handleDeleteData(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const { _id } = event.data;
        await this.reportModel.deleteMany({
            targetId: _id
        });
    }
};
DeleteAssetsListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(providers_1.REPORT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], DeleteAssetsListener);
exports.DeleteAssetsListener = DeleteAssetsListener;
//# sourceMappingURL=assets-delete.listener.js.map