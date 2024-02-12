import { QueueEventService } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { MailerService } from 'src/modules/mailer/services';
import { PerformerService } from 'src/modules/performer/services';
import { AuthService } from 'src/modules/auth/services';
import { UserService } from 'src/modules/user/services';
import { ProductService } from '../services';
export declare class StockProductListener {
    private readonly authService;
    private readonly queueEventService;
    private readonly productService;
    private readonly mailService;
    private readonly fileService;
    private readonly performerService;
    private readonly userService;
    constructor(authService: AuthService, queueEventService: QueueEventService, productService: ProductService, mailService: MailerService, fileService: FileService, performerService: PerformerService, userService: UserService);
    private handleRefundedOrder;
    private handleStockProducts;
    private sendDigitalProductLink;
    private sendPhysicalProduct;
}
