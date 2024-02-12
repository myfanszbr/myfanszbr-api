import { DataResponse } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { CouponService, CouponSearchService } from '../services';
import { ICouponResponse } from '../dtos';
export declare class CouponController {
    private readonly couponService;
    private readonly couponSearchService;
    constructor(couponService: CouponService, couponSearchService: CouponSearchService);
    checkApplyCoupon(code: string, currentUser: PerformerDto): Promise<DataResponse<ICouponResponse>>;
}
