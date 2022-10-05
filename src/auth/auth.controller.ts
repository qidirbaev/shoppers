import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from 'src/common/decorators/guards';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { AuthService } from './auth.service';
import { AdminDto } from './dto/admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './types/token.type';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() body: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(body);
  }

  @Post('auth/local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() body: LoginDto): Promise<Tokens> {
    return this.authService.signinLocal(body);
  }

  @Post('auth/logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: any) {
    return this.authService.logout(userId);
  }

  @Post('auth/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('refresh_token') refresh_token: string
  ) {
    return this.authService.refreshTokens(userId, refresh_token);
  }

  @Get('users/me')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser('sub') userId: number) {
    return this.authService.getMe(userId);
  }

  @Get('users/all')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('users/admin')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  createAdmin(@Body() body: AdminDto) {
    return this.authService.createAdmin(body);
  }
}
