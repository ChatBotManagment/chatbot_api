import { Test, TestingModule } from '@nestjs/testing';
import { ClientContextService } from './client-context.service';

describe('DbContextService', () => {
  let service: ClientContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientContextService],
    }).compile();

    service = module.get<ClientContextService>(ClientContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
