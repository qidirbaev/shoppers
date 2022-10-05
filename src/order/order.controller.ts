import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/decorators/guards';
import { MakeOrderDto } from './dto/make-order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * @description
   * This method is used to make an order
   * @param {MakeOrderDto} order
   *
   * @returns {Promise<any>}
   */
  @Post('order')
  async makeOrder(@Body() order: MakeOrderDto): Promise<any> {
    return this.orderService.makeOrder(order);
  }
}
