import { IsInt, IsNotEmpty } from 'class-validator';

export class ShoppingCartItemDto {
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
