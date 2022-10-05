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

  async addToCart(inventory: ShoppingCartItemDto, userId: number) {
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

    const cart = await this.prisma.shoppingCart.update({
      where: {
        user_id: userId,
      },
      data: {
        total_price: {
          increment: total_price,
        },
        products: {
          push: inventory.product_id,
        },
      },
    });

    // create probable order
    const order = await this.prisma.order.create({
      data: {
        total_price,
        user_id: userId,
        shopping_cart_id: cart.id,
      },
    });

    return cart;
  }

  async removeFromCart(product_id: number, userId: number) {
    const { products: shoppingCartProducts } =
      await this.prisma.shoppingCart.findUnique({
        where: {
          user_id: userId,
        },
        select: {
          products: true,
          total_price: true,
        },
      });

    console.log({ shoppingCartProducts });

    const updatedProductsArray = _.remove(
      shoppingCartProducts,
      (i) => i !== product_id
    );

    console.log({ updatedProductsArray });

    const updatedCart = await this.prisma.shoppingCart.update({
      where: {
        user_id: userId,
      },
      data: {
        products: {
          set: updatedProductsArray,
        },
      },
    });

    return updatedCart;
  }
}
