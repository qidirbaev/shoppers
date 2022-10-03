import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  descr: string;
  @IsNotEmpty()
  @IsString()
  SKU: string;
  @IsInt()
  @IsNotEmpty()
  category_id: number;
  @IsInt()
  discount_id: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
