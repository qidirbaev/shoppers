import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/decorators/guards';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateProductDto } from './dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DiscountDto } from './dto/discount.dto';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('product/create')
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles('admin')
  createProduct(@Body() body: CreateProductDto): Promise<any> {
    return this.productService.createProduct(body);
  }

  @Get('product/all')
  getAllProducts(): Promise<any> {
    return this.productService.getAllProducts();
  }

  @Post('discount')
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles('admin')
  createDiscount(@Body() body: DiscountDto): Promise<any> {
    return this.productService.createDiscount(body);
  }

  @Get('discount/all')
  getAllDiscounts(): Promise<any> {
    return this.productService.getAllDiscounts();
  }

  @Post('category/create')
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles('admin')
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

  @Get('product/:id')
  async getProductById(@Query() id: number): Promise<any> {
    return this.productService.getProductById(id);
  }
}
