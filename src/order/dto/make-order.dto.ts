import { IsInt, IsNotEmpty } from 'class-validator';

export class MakeOrderDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
