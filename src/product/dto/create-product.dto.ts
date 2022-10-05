import {
  IsArray,
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
  desc: string;
  @IsNotEmpty()
  @IsString()
  SKU: string;
  @IsInt()
  @IsNotEmpty()
  category_id: number;
  @IsInt()
  discount_by?: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsArray()
  image: Array<string>;
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
