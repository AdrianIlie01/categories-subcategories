import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {PaginationInterface} from "../shared/Pagination";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Res() res, @Body() createCategoryDto: CreateCategoryDto) {
    try {
      const createCategory = await this.categoryService.create(createCategoryDto);
      return res.status(HttpStatus.CREATED).json(createCategory);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Get()
  async findAll(@Res() res, @Query() pagination: PaginationInterface) {
    try {
      const category:any = await this.categoryService.findAll(pagination);

      res.set({ 'X-Total-Count': `category 0-5/${category.total}`});
      res.set({ 'Content-Range': `category 0-5/${category.total}`});

      return res.status(HttpStatus.OK).json(category.data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Get(':id')
  async findOne(@Res() res, @Param('id') id: number) {
    try {
      const category = await this.categoryService.findOne(id);
      return res.status(HttpStatus.OK).json(category);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);
      return res.status(HttpStatus.OK).json(category);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id: number) {
    try {
      console.log('ctr');
      const deletedCategory = await this.categoryService.remove(id);
      console.log('ctr a');
      return res.status(HttpStatus.OK).json(deletedCategory);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }
}
