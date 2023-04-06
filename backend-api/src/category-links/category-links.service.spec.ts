import { Test, TestingModule } from '@nestjs/testing';
import { CategoryLinksService } from './category-links.service';

describe('CategoryLinksService', () => {
  let service: CategoryLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryLinksService],
    }).compile();

    service = module.get<CategoryLinksService>(CategoryLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
