import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class AdminDto {
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
  @IsString()
  telephone: string;
}
