import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryDto } from './dto';
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

  @Get('all')
  getAllProducts(): Promise<any> {
    return this.productService.getAllProducts();
  }

  @Post('discount')
  discount(@Body() body: DiscountDto): Promise<any> {
    return this.productService.discount(body);
  }

  @Get('discount/all')
  getAllDiscounts(): Promise<any> {
    return this.productService.getAllDiscounts();
  }

  @Post('inventory')
  inventory(@Body() body: InventoryDto): Promise<any> {
    return this.productService.inventory(body);
  }

  @Get('inventory/all')
  getAllInventory(): Promise<any> {
    return this.productService.getAllInventory();
  }
}
