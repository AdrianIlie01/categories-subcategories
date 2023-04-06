import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { CategoryLinksModule } from './category-links/category-links.module';
import {CategoryEntity} from "./category/entities/category.entity";
import {CategoryLinkEntity} from "./category-links/entities/category-link.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'project',
      password: 'project',
      database: 'project',
      entities: [CategoryEntity, CategoryLinkEntity],
      synchronize: true,
    }),
    CategoryModule,
    CategoryLinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
