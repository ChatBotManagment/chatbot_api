import { Test, TestingModule } from '@nestjs/testing';
import { ClientInfoController } from './client-info.controller';
import { ClientInfoService } from './client-info.service';

describe('ClientInfoController', () => {
  let controller: ClientInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientInfoController],
      providers: [ClientInfoService],
    }).compile();

    controller = module.get<ClientInfoController>(ClientInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
