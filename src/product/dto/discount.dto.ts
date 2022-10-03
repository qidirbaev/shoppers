import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class DiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc: string;
  @IsNumber()
  @IsNotEmpty()
  discount_percent: number;
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
