import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { DiscountDto } from './dto/discount.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  createProduct(@Body() body: CreateProductDto): Promise<any> {
    return this.productService.createProduct(body);
  }

  @Post('discount')
  discount(@Body() body: DiscountDto): Promise<any> {
    return this.productService.discount(body);
  }
}
