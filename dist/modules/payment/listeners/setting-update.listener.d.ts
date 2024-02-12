import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { PaymentCardModel, PaymentCustomerModel, SubscriptionPlanModel } from '../models';
export declare class SettingsUpdatedListener {
    private readonly queueEventService;
    private readonly paymentCardModel;
    private readonly paymentCustomerModel;
    private readonly subscriptionPlanModel;
    constructor(queueEventService: QueueEventService, paymentCardModel: Model<PaymentCardModel>, paymentCustomerModel: Model<PaymentCustomerModel>, subscriptionPlanModel: Model<SubscriptionPlanModel>);
    private subscribe;
}
