import { Test, TestingModule } from '@nestjs/testing';
import { ClientInfoService } from './client-info.service';

describe('ClientInfoService', () => {
  let service: ClientInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientInfoService],
    }).compile();

    service = module.get<ClientInfoService>(ClientInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
