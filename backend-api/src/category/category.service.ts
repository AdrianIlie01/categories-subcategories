import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {CategoryEntity} from "./entities/category.entity";
import {PaginationInterface} from "../shared/Pagination";
import {CategoryLinksService} from "../category-links/category-links.service";
import {Like} from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
      private readonly categoryLinksService: CategoryLinksService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { category_name, description } = createCategoryDto;
      const category = new CategoryEntity();
      category.category_name = category_name;
      category.description = description;

      const savedCategory = await category.save();
      return savedCategory;
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

      const category =
          objFilter.length > 0 && objSort.length < 1
          ? await CategoryEntity.find({
            where: {
              [objFilter[0].id]: Like(`%${objFilter[0].value}%`),
            },
            skip: page == 0 ? page * size :skip,
            take: size,
          })
          : objFilter.length < 1 && objSort.length > 0
              ? await CategoryEntity.find({
                order:{
                  [objSort[0].id]: objSort[0].desc == false ? 'ASC' : 'DESC'
                },
                skip: page == 0 ? page * size :skip,
                take: size,
              })
          : objFilter.length > 0 && objSort.length > 0
          ? await CategoryEntity.find({
                    where: {
                      [objFilter[0].id]: Like(`%${objFilter[0].value}%`),

                    },
                    order:{
                      [objSort[0].id]: objSort[0].desc == false ? 'ASC' : 'DESC'
                    },
                    skip: page == 0 ? page * size :skip,
                    take: size,
                  })
          : await CategoryEntity.find({
              skip: page * size,
              take: size,
            });

      console.log(category);
      console.log(category.length);


      const response = {
        data: category,
        total: category.length
      };
      return response;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async findOne(category_id: number) {
    try {
      const category = await CategoryEntity.find({
        where: { id: category_id },
      });
      return category;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { category_name, description } = updateCategoryDto;
      const category = await CategoryEntity.findOne({
        where: {id: id},
      });

      const categoryName = category.category_name;
      const categoryDescription = category.description;

      typeof category_name !== 'undefined'? category.category_name = category_name: category.category_name = categoryName;
      typeof description !== 'undefined'? category.description = description: category.description = categoryDescription;


      return await category.save();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number) {
    try {
      const category = await CategoryEntity.findOne({
        where: {id: id},
      });

      await Promise.all(
       await this.categoryLinksService.remove(category.id)
      );
      await category.remove();

      return {
        message: "category.delete"
      }
    } catch (e) {
      throw  new BadRequestException(e.message);
    }
  }

  // async findSubcategories(category_id: number) {
  //   try {
  //
  //     const parentCategory = await this.categoryLinksService.findParent(category_id);
  //
  //     const subcategories = parentCategory.map((parent) => {
  //       return {
  //         subcategoryId: parent.category.id,
  //         subcategoryName: parent.category.category_name
  //       }
  //     });
  //
  //     console.log('parentCategory');
  //     console.log(parentCategory);
  //
  //     console.log('subcategories');
  //     console.log(subcategories);
  //     return subcategories;
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async findOne(category_id: number) {
  //   try {
  //
  //     const category = await CategoryEntity.findOne({where: {id: category_id}});
  //
  //     const parentCategory = await this.categoryLinksService.findParent(category_id);
  //
  //     const subcategories = await Promise.all(parentCategory.map((parent) => {
  //           return {
  //             subcategoryId: parent.category.id,
  //             subcategoryName: parent.category.category_name
  //           }
  //         })
  //     );
  //
  //     const data = {
  //       id: category.id,
  //       subcategories: subcategories
  //     }
  //
  //     console.log('parentCategory');
  //     console.log(parentCategory);
  //
  //     console.log('subcategories');
  //     console.log(subcategories);
  //     console.log(data);
  //     return data;
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }


  // async addSubcategory(id: number, addSubcategoryDto: AddSubcategoryDto) {
  //   try {
  //     const { categoryId } = addSubcategoryDto;
  //     const parent = await CategoryEntity.findOne(id);
  //     console.log(parent);
  //
  //     const subcategory = await CategoryEntity.findOne(categoryId);
  //     console.log(subcategory);
  //
  //     const savedCategoryLink = await this.categoryLinksService.create(parent, subcategory);
  //
  //     return savedCategoryLink;
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }
}

