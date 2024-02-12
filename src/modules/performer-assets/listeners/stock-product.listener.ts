import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { TOKEN_TRANSACTION_SUCCESS_CHANNEL, PURCHASE_ITEM_TYPE } from 'src/modules/token-transaction/constants';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { EVENT } from 'src/kernel/constants';
import { MailerService } from 'src/modules/mailer/services';
import { PerformerService } from 'src/modules/performer/services';
import { AuthService } from 'src/modules/auth/services';
import { UserService } from 'src/modules/user/services';
import { REFUND_ORDER_CHANNEL } from 'src/modules/order/constants';
import { OrderDto } from 'src/modules/order/dtos';
import { ProductService } from '../services';
import { PRODUCT_TYPE } from '../constants';
import { ProductDto } from '../dtos';

const UPDATE_STOCK_TOPIC = 'UPDATE_STOCK_TOPIC';

@Injectable()
export class StockProductListener {
  constructor(
    private readonly authService: AuthService,
    private readonly queueEventService: QueueEventService,
    private readonly productService: ProductService,
    private readonly mailService: MailerService,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    this.queueEventService.subscribe(
      TOKEN_TRANSACTION_SUCCESS_CHANNEL,
      UPDATE_STOCK_TOPIC,
      this.handleStockProducts.bind(this)
    );
    this.queueEventService.subscribe(
      REFUND_ORDER_CHANNEL,
      UPDATE_STOCK_TOPIC,
      this.handleRefundedOrder.bind(this)
    );
  }

  private async handleRefundedOrder(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return;
    }
    const { productId, quantity }: OrderDto = event.data;
    const product = await this.productService.findById(productId);
    if (!product || product.type !== 'physical') {
      await this.productService.updateStock(product._id, quantity);
    }
  }

  private async handleStockProducts(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return false;
    }
    const transaction = event.data;
    if (transaction.type !== PURCHASE_ITEM_TYPE.PRODUCT || !transaction.products || !transaction.products.length) {
      return false;
    }
    const prodIds = transaction.products.map((p) => p.productId);
    const performer = await this.performerService.findById(transaction.performerId);
    const user = await this.userService.findById(transaction.sourceId);
    const products = await this.productService.findByIds(prodIds);
    products.reduce(async (cb, prod) => {
      await cb;
      if (prod.type === PRODUCT_TYPE.PHYSICAL) {
        const p = transaction.products.find((produ) => `${produ.productId}` === `${prod._id}`);
        await this.productService.updateStock(prod._id, -(p.quantity || 1));
        await this.sendPhysicalProduct(prod, performer, user);
      }
      if (prod.type === PRODUCT_TYPE.DIGITAL && prod.digitalFileId) {
        await this.sendDigitalProductLink(
          transaction,
          performer,
          user,
          prod.digitalFileId
        );
      }
    }, Promise.resolve());
    return true;
  }

  private async sendDigitalProductLink(transaction, performer, user, fileId) {
    const auth = await this.authService.findBySource({ source: 'user', sourceId: transaction.sourceId });
    const token = auth && await this.authService.updateAuthSession('user', auth.sourceId);
    const file = await this.fileService.findById(fileId);
    if (file) {
      const digitalLink = token ? `${new FileDto(file).getUrl()}?productId=${transaction.targetId}&token=${token}` : new FileDto(file).getUrl();
      user && user.email && await this.mailService.send({
        subject: 'Digital file',
        to: user.email,
        data: {
          performer,
          user,
          transaction,
          digitalLink
        },
        template: 'send-user-digital-product'
      });
    }
  }

  private async sendPhysicalProduct(product: ProductDto, performer, user) {
    performer.email && await this.mailService.send({
      subject: 'Product has been ordered',
      to: performer.email,
      data: {
        userName: user?.name || user?.username,
        productName: product?.name,
        productDescription: product?.description
      },
      template: 'performer-physical-product'
    });
  }
}
