import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  CreateProductDto,
  DiscountDto,
} from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private searchCache: Array<any> = [];

  async createProduct(product: CreateProductDto) {
    try {
      const newProduct = await this.prisma.product.create({
        data: {
          name: product.name,
          desc: product.desc,
          SKU: product.SKU,
          category_id: product.category_id,
          price: product.price,
          discount_by: product.discount_by,
          quantity: product.quantity,
          image: product.image,
        },
      });

      return newProduct;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          product_category: {
            select: {
              name: true,
            },
          },
          discount: true,
        },
      });

      return products;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  async createDiscount(discount: DiscountDto) {
    try {
      const newDiscount = await this.prisma.discount.create({
        data: {
          name: discount.name,
          desc: discount.desc,
          discount_percent: discount.discount_percent,
          active: discount.active,
        },
      });

      await this.prisma.product.updateMany({
        where: {
          id: {
            in: discount.products,
          },
        },
        data: {
          discount_by: newDiscount.id,
        },
      });

      return newDiscount;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  async getAllDiscounts() {
    try {
      const discounts = await this.prisma.discount.findMany({
        include: {
          products: true,
        },
      });

      return discounts;
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  async createCategory(data: CreateCategoryDto) {
    const newCategory = await this.prisma.category.create({
      data,
    });

    return newCategory;
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return categories;
  }

  async searchProducts(query: string) {
    const results = await this.searchProductsCache(query);
    return results;
  }

  private searchProductsCache(query: string) {
    return new Promise(async (resolve) => {
      const search = this.searchCache.find(
        (item) => item.query === query
      );

      if (search) {
        return search.results;
      }

      const results = await this.prisma.product.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        include: {
          product_category: {
            select: {
              name: true,
            },
          },
          discount: true,
        },
      });

      if (this.searchCache.length > 100) {
        this.searchCache.splice(0, 1);
      }

      this.searchCache.push({
        query,
        results,
      });

      return resolve(results);
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        product_category: {
          select: {
            name: true,
          },
        },
        discount: true,
      },
    });

    return product;
  }

  async filterProductsByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        category_id: {
          equals: categoryId,
        },
      },
      include: {
        product_category: {
          select: {
            name: true,
          },
        },
        discount: true,
      },
    });

    return products;
  }

  async filterProductsByPrice(
    min: number = 0,
    max: number = Infinity
  ) {
    const products = await this.prisma.product.findMany({
      where: {
        price: {
          gte: min,
          lte: max,
        },
      },
      include: {
        product_category: {
          select: {
            name: true,
          },
        },
        discount: true,
      },
    });

    return products;
  }

  async filterProductsByDiscount(discountId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        discount_by: {
          equals: discountId,
        },
      },
      include: {
        product_category: {
          select: {
            name: true,
          },
        },
        discount: true,
      },
    });

    return products;
  }

  private async paginateProducts(
    page: number = 1,
    limit: number = 10,
    options?: any
  ) {
    const products = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    return products;
  }
}
