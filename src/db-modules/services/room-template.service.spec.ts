import { Test, TestingModule } from '@nestjs/testing';
import { RoomTemplateService } from './room-template.service';

describe('RoomTemplateService', () => {
  let service: RoomTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomTemplateService],
    }).compile();

    service = module.get<RoomTemplateService>(RoomTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
