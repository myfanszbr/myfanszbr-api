import { Injectable, Inject, HttpException, forwardRef } from "@nestjs/common";
import axios from "axios";
import { UserCreatePayload } from "src/modules/user/payloads";

const pay2mApi = axios.create({
  baseURL: process.env.PAY2M_BASE_URL || "",
});

pay2mApi.defaults.headers.common[
  "Authorization"
] = `Basic ${process.env.PAY2M_ACCESS_TOKEN}`;

@Injectable()
export class Pay2mService {
  constructor() {} // private readonly subscriptionPlanModel: Model<SubscriptionPlanModel> // @Inject(SUBSCRIPTION_PLAN_MODEL_PROVIDER) // private readonly customerCardService: CustomerCardService, // @Inject(forwardRef(() => CustomerCardService))

  public async createCustomer(user: UserCreatePayload) {
    try {
      const { data } = pay2mApi.post<any>("/customers", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        document: {
          number: user.documentNumber,
          type: "cpf",
        },
        externalRef: user.id,
      });

      return data.id;
    } catch (error) {
      throw error;
    }
  }

  public async createRecipient(user: any) {
    try {
      const { data } = pay2mApi.post<any>("/recipients", {
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

      return data.id;
    } catch (error) {
      throw error;
    }
  }

  public async createPayment(payment: {
    customerId: number;
    recipientId?: number;
    amount: number;
    product: {
      name: string;
      price: number;
      quantity: number;
      id: string;
    };
  }) {
    try {
      const { data } = pay2mApi.post<any>("/transactions", {
        customer: {
          id: payment.customerId,
        },
        pix: {
          expiresInDays: 1,
        },
        amount: payment.amount,
        paymentMethod: "pix",
        items: [
          {
            tangible: false,
            title: payment.product.name,
            unitPrice: payment.product.price,
            quantity: payment.product.quantity,
            externalRef: payment.product.id,
          },
        ],
        postbackUrl: "12121",
        metadata: JSON.stringify(payment),
        ...(payment.recipientId && {
          splits: [
            {
              recipientId: payment.recipientId,
              amount: payment.amount, // Multiplicar pela porcentagem
            },
          ],
        }),
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
