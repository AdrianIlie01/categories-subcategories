import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateCategoryLinkDto } from './dto/create-category-link.dto';
import { UpdateCategoryLinkDto } from './dto/update-category-link.dto';
import {CategoryLinkEntity} from "./entities/category-link.entity";
import {PaginationInterface} from "../shared/Pagination";
import {CategoryEntity} from "../category/entities/category.entity";
import {Like} from "typeorm";
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class CategoryLinksService {
  constructor(
      @InjectConnection()
      private readonly connection: Connection,
  ) {}

  async create(createCategoryLinkDto: CreateCategoryLinkDto) {
   try {
     const { category, parent } = createCategoryLinkDto

     const subcategoryEntity = await CategoryEntity.findOne({where: {category_name: category}});
     const parentEntity = await CategoryEntity.findOne({where: {category_name: parent}});

     const categoryLink = new CategoryLinkEntity();

     categoryLink.category = subcategoryEntity;
     categoryLink.parent = parentEntity;
     const savedCategoryLink = await categoryLink.save();
     return savedCategoryLink;
   } catch (e) {
     throw new BadRequestException(e.message);
   }
  }

  async findAll(query: PaginationInterface) {
    try {
      const { page, size } = query;
      const skip: number = (page - 1) * size;

      const filter = query.filters;
      const sort = query.sorting;

      const objFilter = typeof filter !== 'undefined'? JSON.parse(filter.replace("'", '').replace("'", ''))
          :console.log('filter is undefined');

      const objSort = typeof sort !== 'undefined' ? JSON.parse(sort.replace("'", '').replace("'", ''))
          :console.log('sort is undefined');

      const categoryLink =
          objFilter.length > 0 && objSort.length < 1
              ? await this.connection
                  .getRepository(CategoryLinkEntity)
                  .createQueryBuilder('category_links')
                  .innerJoinAndSelect('category_links.category','category')
                  .innerJoinAndSelect('category_links.parent','parent')
                  .where(
                      `${objFilter[0].id === 'id' ? 'category_links.id' : objFilter[0].id } like :value`,
                      {value: `%${objFilter[0].value}%`}
                  )
                  .skip(page == 0 ? page * size :skip)
                  .take(size)
                  .getMany()
              : objFilter.length < 1 && objSort.length > 0
                  ? await this.connection
                      .getRepository(CategoryLinkEntity)
                      .createQueryBuilder('category_links')
                      .innerJoinAndSelect('category_links.category','category')
                      .innerJoinAndSelect('category_links.parent','parent')
                      .orderBy(`${objSort[0].id === 'id' ? 'category_links.id' : objSort[0].id }`,
                          objSort[0].desc == false ? 'ASC' : 'DESC')                      .skip(page == 0 ? page * size :skip)
                      .take(size)
                      .getMany()
                  : objFilter.length > 0 && objSort.length > 0
                      ? await this.connection
                          .getRepository(CategoryLinkEntity)
                          .createQueryBuilder('category_links')
                          .innerJoinAndSelect('category_links.category','category')
                          .innerJoinAndSelect('category_links.parent','parent')
                          .where(
                              `${objFilter[0].id === 'id' ? 'category_links.id' : objFilter[0].id } like :value`,
                              {value: `%${objFilter[0].value}%`}
                          )
                          .orderBy(`${objSort[0].id === 'id' ? 'category_links.id' : objSort[0].id }`,
                              objSort[0].desc == false ? 'ASC' : 'DESC')
                          .skip(page == 0 ? page * size :skip)
                          .take(size)
                          .getMany()
                      :  await this.connection
                          .getRepository(CategoryLinkEntity)
                          .createQueryBuilder('category_links')
                          .innerJoinAndSelect('category_links.category','category')
                          .innerJoinAndSelect('category_links.parent','parent')
                          .orderBy("category_links.id",  'ASC')
                          .skip(page == 0 ? page * size :skip)
                          .take(size)
                          .getMany();

      console.log(categoryLink);

      return {
        data: categoryLink,
        total: categoryLink.length
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: number) {
    try {
      const categoryLink = await CategoryLinkEntity.find({
        relations: ['category', 'parent'],
        where: { id: id },
      });
      console.log(categoryLink);
      return categoryLink;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: number, updateCategoryLinkDto: UpdateCategoryLinkDto) {
    try {
      const { category, parent } = updateCategoryLinkDto;

      const subcategoryEntity = await CategoryEntity.findOne({where: {category_name: category}});
      const parentEntity = await CategoryEntity.findOne({where: {category_name: parent}});

      const categoryLink = await CategoryLinkEntity.findOne({
        where: {id: id},
      });
      categoryLink.category = subcategoryEntity;
      categoryLink.parent = parentEntity;

      return await categoryLink.save();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number) {
    try {
      const categoryLink = await CategoryLinkEntity.find({
        where: {
            id: id
        },
      });
      const deletedCategoryLink = await Promise.all(
          categoryLink.map(async (row: CategoryLinkEntity) => {
       return  await row.remove();
      })
      );
      return deletedCategoryLink;
    } catch (e) {
      throw  new BadRequestException(e.message);
    }
  }
  async removeCategoryLink(id: number) {
    try {
      const categoryLink = await CategoryLinkEntity.find({
        relations: ['category', 'parent'],
        where: [
            { category: {id: id} },  // where category = id OR parent = id
            { parent: {id: id} }
        ],
      });
      const deletedCategoryLink = await Promise.all(
          categoryLink.map(async (row: CategoryLinkEntity) => {
       return  await row.remove();
      })
      );
      return deletedCategoryLink;
    } catch (e) {
      throw  new BadRequestException(e.message);
    }
  }

}
