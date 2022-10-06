import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';
import { AccessTokenGuard } from 'src/common/decorators/guards';
import { ShoppingCartItemDto } from './dto/shopping-cart-item.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('add-to-cart')
  // @UseGuards(AccessTokenGuard)
  async addToCart(
    @Body() inventory: ShoppingCartItemDto,
    @GetCurrentUser('sub') userId: number
  ): Promise<any> {
    return this.orderService.addToCart(inventory, userId);
  }

  @Post('remove-from-cart')
  // @UseGuards(AccessTokenGuard)
  async removeFromCart(
    @Body() product_id: number,
    @GetCurrentUser('sub') userId: number
  ): Promise<any> {
    return this.orderService.removeFromCart(product_id, userId);
  }
}
