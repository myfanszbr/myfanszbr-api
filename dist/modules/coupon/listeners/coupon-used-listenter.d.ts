import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { CouponService } from '../services/coupon.service';
export declare class UpdateCouponUsesListener {
    private readonly userService;
    private readonly queueEventService;
    private readonly couponService;
    private readonly mailerService;
    constructor(userService: UserService, queueEventService: QueueEventService, couponService: CouponService, mailerService: MailerService);
    handleUpdateCoupon(event: QueueEvent): Promise<void>;
}
