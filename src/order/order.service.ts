import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';
import { ShoppingCartItemDto } from './dto/shopping-cart-item.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  private totalPrice(
    productPrice: any,
    quantity: number,
    discount: any
  ): number {
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

  // ** All of Order Service code should be transacted in a transaction

  /**
   * @description Service to add a product to user's the shopping cart
   * @param   {number} userId
   * @param   {object} shoppingCartItem
   * @returns {object} shoppingCart
   */

  async addToCart(
    inventory: ShoppingCartItemDto,
    userId: number
  ): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: inventory.product_id,
      },
      include: {
        discount: true,
      },
    });

    if (
      !product ||
      product.quantity < inventory.quantity ||
      product.in_stock === false
    ) {
      throw new BadRequestException('Please provide a valid product');
    }

    const total_price = this.totalPrice(
      product.price,
      inventory.quantity,
      product.discount
    );

    const shoppingCart = await this.prisma.shoppingCart.update({
      where: {
        user_id: userId,
      },
      data: {
        total_price: {
          increment: total_price,
        },
        items: {
          create: {
            product_id: inventory.product_id,
            quantity: inventory.quantity,
            price: total_price,
          },
        },
      },
      select: {
        id: true,
        total_price: true,
        items: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    return shoppingCart;
  }

  async removeFromCart(
    product_id: number,
    userId: number
  ): Promise<any> {
    // TODO: Refactor this code
    return await this.prisma.$transaction(async (_prisma) => {
      const shoppingCart = await _prisma.shoppingCart.findUnique({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          total_price: true,
          items: {
            select: {
              id: true,
              product_id: true,
              quantity: true,
              price: true,
            },
          },
        },
      });

      const item = _.find(shoppingCart.items, {
        product_id: product_id,
      });

      this.totalPrice(item.price, item.quantity, null);

      const updatedShoppingCart = await _prisma.shoppingCart.update({
        where: {
          id: shoppingCart.id,
        },
        data: {
          total_price: {
            decrement: item.price,
          },
          items: {
            delete: {
              id: item.id,
            },
          },
        },
        select: {
          id: true,
          total_price: true,
          items: {
            select: {
              id: true,
              product_id: true,
              quantity: true,
              price: true,
            },
          },
        },
      });

      return updatedShoppingCart;
    });
  }
}
