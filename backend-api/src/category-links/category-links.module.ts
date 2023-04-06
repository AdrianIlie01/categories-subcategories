import { Module } from '@nestjs/common';
import { CategoryLinksService } from './category-links.service';
import { CategoryLinksController } from './category-links.controller';

@Module({
  controllers: [CategoryLinksController],
  providers: [CategoryLinksService]
})
export class CategoryLinksModule {}
