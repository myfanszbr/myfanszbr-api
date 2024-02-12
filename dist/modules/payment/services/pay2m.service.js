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
exports.Pay2mService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const pay2mApi = axios_1.default.create({
    baseURL: process.env.PAY2M_BASE_URL || "",
});
pay2mApi.defaults.headers.common["Authorization"] = `Basic ${process.env.PAY2M_ACCESS_TOKEN}`;
let Pay2mService = class Pay2mService {
    constructor() { }
    async createCustomer(id, user) {
        try {
            const response = await pay2mApi.post("/customers", {
                name: user.name,
                email: user.email,
                phone: user.phone,
                document: {
                    number: user.documentNumber,
                    type: "cpf",
                },
                externalRef: id,
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async createRecipient(user) {
        try {
            const response = await pay2mApi.post("/recipients", {
                legalName: user.name,
                document: {
                    number: user.documentNumber,
                    type: "cpf",
                },
                transferSettings: {
                    transferEnabled: true,
                    automaticAnticipationEnabled: true,
                    anticipatableVolumePercentage: 100,
                },
                bankAccount: {
                    bankCode: user.bankCode,
                    agencyNumber: user.agencyNumber,
                    accountDigit: user.accountDigit,
                    accountNumber: user.accountNumber,
                    type: user.accountType,
                    legalName: user.name,
                    documentType: "cpf",
                    documentNumber: user.documentNumber,
                },
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async createPayment(payment) {
        try {
            const response = await pay2mApi.post("/transactions", Object.assign({ customer: {
                    id: payment.customerId,
                }, pix: {
                    expiresInDays: 1,
                }, amount: payment.amount, paymentMethod: "pix", items: [
                    {
                        tangible: false,
                        title: payment.product.name,
                        unitPrice: payment.product.price,
                        quantity: payment.product.quantity,
                        externalRef: payment.product.productId,
                    },
                ], postbackUrl: "12121", metadata: JSON.stringify(payment) }, (payment.recipientId && {
                splits: [
                    {
                        recipientId: payment.recipientId,
                        amount: payment.amount,
                    },
                ],
            })));
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
};
Pay2mService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Pay2mService);
exports.Pay2mService = Pay2mService;
//# sourceMappingURL=pay2m.service.js.map