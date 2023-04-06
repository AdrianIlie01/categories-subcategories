import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {CategoryLinksService} from "../category-links/category-links.service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryLinksService]
})
export class CategoryModule {}
