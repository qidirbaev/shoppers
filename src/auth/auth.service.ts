import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/token.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signTokens(
    userId: number,
    username: string,
  ): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '15m',
          secret: 'access-token-secret',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '7d',
          secret: 'refresh-token-secret',
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRtx: hash,
      },
    });
  }

  async signupLocal(body: CreateUserDto): Promise<Tokens> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          username: body.username,
          password: hashedPassword,
          hashedRtx: '',
          first_name: body.first_name,
          last_name: body.last_name,
          telephone: body.telephone,
        },
      });

      const tokens = await this.signTokens(
        newUser.id,
        newUser.username,
      );

      await this.updateRefreshToken(newUser.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signinLocal(body: LoginDto): Promise<Tokens> {
    const { username, password } = body;
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user)
      throw new BadRequestException('Invalid username or password');

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      throw new BadRequestException('Invalid username or password');

    const tokens = await this.signTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRtx: {
          not: '',
        },
      },
      data: {
        hashedRtx: '',
      },
    });
  }

  async refreshTokens(userId: number, refresh_token: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new BadRequestException('Invalid token');

    const isValid = await bcrypt.compare(
      refresh_token,
      user.hashedRtx,
    );

    if (!isValid) throw new BadRequestException('Invalid token');

    const tokens = await this.signTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }
}
