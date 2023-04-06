import {Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query} from '@nestjs/common';
import { CategoryLinksService } from './category-links.service';
import { CreateCategoryLinkDto } from './dto/create-category-link.dto';
import { UpdateCategoryLinkDto } from './dto/update-category-link.dto';
import {PaginationInterface} from "../shared/Pagination";

@Controller('category-links')
export class CategoryLinksController {
  constructor(private readonly categoryLinksService: CategoryLinksService) {}

  @Post()
  async create(@Res() res, @Body() createCategoryLinkDto: CreateCategoryLinkDto) {
    try {
      const createCategoryLink = await this.categoryLinksService.create(createCategoryLinkDto);
      return res.status(HttpStatus.CREATED).json(createCategoryLink);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Get()
  async findAll(@Res() res, @Query() pagination: PaginationInterface) {
    try {
      const categoryLinks: any = await this.categoryLinksService.findAll(pagination);
      res.set({ 'X-Total-Count': `category-links 0-5/${categoryLinks.total}`});
      res.set({ 'Content-Range': `category-links 0-5/${categoryLinks.total}`});
      return res.status(HttpStatus.OK).json(categoryLinks.data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }

  @Get(':id')
  async findOne(@Res() res, @Param('id') id: number) {
    try {
      const categoryLink = await this.categoryLinksService.findOne(id);
      return res.status(HttpStatus.OK).json(categoryLink);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }  }

  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() updateCategoryLinkDto: UpdateCategoryLinkDto) {
    try {
      const categoryLink = await this.categoryLinksService.update(id, updateCategoryLinkDto);
      return res.status(HttpStatus.OK).json(categoryLink);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id: number) {
    try {
      const deleteCategoryLink = await this.categoryLinksService.remove(id);
      console.log(deleteCategoryLink);
      return res.status(HttpStatus.OK).json(deleteCategoryLink);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }
}
