import { Test, TestingModule } from '@nestjs/testing';
import { CategoryLinksController } from './category-links.controller';
import { CategoryLinksService } from './category-links.service';

describe('CategoryLinksController', () => {
  let controller: CategoryLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryLinksController],
      providers: [CategoryLinksService],
    }).compile();

    controller = module.get<CategoryLinksController>(CategoryLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
