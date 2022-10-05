import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MakeOrderDto } from './dto/make-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  private totalPrice(
    productPrice: any,
    quantity: number,
    discount: any
  ) {
    let price: number;

    if (discount) {
      price =
        productPrice *
        quantity *
        (1 - discount.discount_percent / 100);
    } else {
      price = productPrice * quantity;
    }

    return price;
  }

  async makeOrder(order: MakeOrderDto) {
    // Check if the user address is valid
    const address = await this.prisma.userAddress.findUnique({
      where: {
        id: order.user_id,
      },
    });

    if (!address) {
      throw new BadRequestException('Please provide a valid address');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: order.product_id,
      },
      include: {
        discount: true,
      },
    });
  }
}
