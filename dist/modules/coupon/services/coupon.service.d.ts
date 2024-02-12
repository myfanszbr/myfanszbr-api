import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { PaymentTransactionModel } from 'src/modules/payment/models';
import { CouponCreatePayload, CouponUpdatePayload } from '../payloads';
import { CouponDto } from '../dtos';
import { CouponModel } from '../models';
export declare class CouponService {
    private readonly couponModel;
    private readonly paymentModel;
    constructor(couponModel: Model<CouponModel>, paymentModel: Model<PaymentTransactionModel>);
    findByIdOrCode(id: string | Types.ObjectId): Promise<CouponDto>;
    checkExistingCode(code: string, id?: string | Types.ObjectId): Promise<boolean>;
    create(payload: CouponCreatePayload): Promise<CouponDto>;
    update(id: string | Types.ObjectId, payload: CouponUpdatePayload): Promise<any>;
    delete(id: string | Types.ObjectId | CouponModel): Promise<boolean>;
    applyCoupon(code: string, userId: string | Types.ObjectId): Promise<CouponDto>;
    checkUsedCoupon(code: string, userId: string | Types.ObjectId): Promise<boolean>;
    updateNumberOfUses(couponId: string | Types.ObjectId): Promise<void>;
}
