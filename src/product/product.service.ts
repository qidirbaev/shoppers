import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(product: CreateProductDto) {
    try {
      const newProduct = await this.prisma.product.create({
        data: {
          name: product.name,
          descr: product.descr,
          SKU: product.SKU,
          category_id: product.category_id,
          price: product.price,
          discount_id: product.discount_id,
        },
      });

      return newProduct;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  async discount(discount: DiscountDto) {
    try {
      const newDiscount = await this.prisma.discount.create({
        data: {
          name: discount.name,
          desc: discount.desc,
          discount_percent: discount.discount_percent,
          active: discount.active,
        },
      });

      return newDiscount;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }
}
