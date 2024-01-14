import { Test, TestingModule } from '@nestjs/testing';
import { RoomTemplateController } from './room-template.controller';
import { RoomTemplateService } from './room-template.service';

describe('RoomTemplateController', () => {
  let controller: RoomTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomTemplateController],
      providers: [RoomTemplateService],
    }).compile();

    controller = module.get<RoomTemplateController>(RoomTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
