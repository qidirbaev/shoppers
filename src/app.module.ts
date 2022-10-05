import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
