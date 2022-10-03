import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const newCategory = await this.prisma.productCategory.create({
      data,
    });

    return newCategory;
  }
}
