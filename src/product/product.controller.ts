import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { DiscountDto } from './dto/discount.dto';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Post('product/create')
  // createProduct(@Body() body: CreateProductDto): Promise<any> {
  //   return this.productService.createProduct(body);
  // }

  @Get('product/all')
  getAllProducts(): Promise<any> {
    return this.productService.getAllProducts();
  }

  @Post('discount')
  createDiscount(@Body() body: DiscountDto): Promise<any> {
    return this.productService.createDiscount(body);
  }

  @Get('discount/all')
  getAllDiscounts(): Promise<any> {
    return this.productService.getAllDiscounts();
  }

  @Post('category/create')
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.productService.createCategory(category);
  }

  @Get('category/all')
  async getAllCategories() {
    return this.productService.getAllCategories();
  }

  @Post('search')
  async searchProducts(@Query() query: string): Promise<any> {
    return this.productService.searchProducts(query);
  }
}
