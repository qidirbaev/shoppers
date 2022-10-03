import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsNotEmpty()
  @IsString()
  telephone: string;
  // @IsArray()
  // user_address: Array<any>;
  // @IsArray()
  // user_payment: Array<any>;
}
