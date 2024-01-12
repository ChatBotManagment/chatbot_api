import { Test, TestingModule } from '@nestjs/testing';
import { ConvTemplatesService } from './conv-templates.service';

describe('ConvTemplatesService', () => {
  let service: ConvTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvTemplatesService],
    }).compile();

    service = module.get<ConvTemplatesService>(ConvTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
