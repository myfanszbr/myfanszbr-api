import { DataResponse, PageableData } from 'src/kernel';
import { CouponService, CouponSearchService } from '../services';
import { CouponCreatePayload, CouponUpdatePayload, CouponSearchRequestPayload } from '../payloads';
import { CouponDto, ICouponResponse } from '../dtos';
export declare class AdminCouponController {
    private readonly couponService;
    private readonly couponSearchService;
    constructor(couponService: CouponService, couponSearchService: CouponSearchService);
    create(payload: CouponCreatePayload): Promise<DataResponse<CouponDto>>;
    update(id: string, payload: CouponUpdatePayload): Promise<DataResponse<any>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: CouponSearchRequestPayload): Promise<DataResponse<PageableData<ICouponResponse>>>;
    details(id: string): Promise<DataResponse<CouponDto>>;
}
