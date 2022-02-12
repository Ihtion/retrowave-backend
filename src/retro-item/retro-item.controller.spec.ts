import { Test, TestingModule } from '@nestjs/testing';
import { RetroItemController } from './retro-item.controller';
import { RetroItemService } from './retro-item.service';

describe('RetroItemController', () => {
  let controller: RetroItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetroItemController],
      providers: [RetroItemService],
    }).compile();

    controller = module.get<RetroItemController>(RetroItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
