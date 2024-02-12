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
exports.NewSubscriptionListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../subscription/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const providers_1 = require("../providers");
const constants_3 = require("../constants");
const NEW_CONVERSATION_TOPIC = 'NEW_CONVERSATION_TOPIC';
let NewSubscriptionListener = class NewSubscriptionListener {
    constructor(queueEventService, conversationModel) {
        this.queueEventService = queueEventService;
        this.conversationModel = conversationModel;
        this.queueEventService.subscribe(constants_2.NEW_SUBSCRIPTION_CHANNEL, NEW_CONVERSATION_TOPIC, this.handleData.bind(this));
    }
    async handleData(event) {
        if (event.eventName !== constants_1.EVENT.CREATED)
            return;
        const subscription = event.data;
        let conversation = await this.conversationModel
            .findOne({
            type: constants_3.CONVERSATION_TYPE.PRIVATE,
            recipients: {
                $all: [
                    {
                        source: 'user',
                        sourceId: (0, string_helper_1.toObjectId)(subscription.userId)
                    },
                    {
                        source: 'performer',
                        sourceId: (0, string_helper_1.toObjectId)(subscription.performerId)
                    }
                ]
            }
        })
            .lean()
            .exec();
        if (!conversation) {
            conversation = await this.conversationModel.create({
                type: constants_3.CONVERSATION_TYPE.PRIVATE,
                recipients: [
                    {
                        source: 'user',
                        sourceId: (0, string_helper_1.toObjectId)(subscription.userId)
                    },
                    {
                        source: 'performer',
                        sourceId: (0, string_helper_1.toObjectId)(subscription.performerId)
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }
};
NewSubscriptionListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], NewSubscriptionListener);
exports.NewSubscriptionListener = NewSubscriptionListener;
//# sourceMappingURL=generate-conversation.listener.js.map