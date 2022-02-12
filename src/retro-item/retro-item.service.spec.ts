import { Test, TestingModule } from '@nestjs/testing';
import { RetroItemService } from './retro-item.service';

describe('RetroItemService', () => {
  let service: RetroItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetroItemService],
    }).compile();

    service = module.get<RetroItemService>(RetroItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
