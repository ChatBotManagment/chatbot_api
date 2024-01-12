import { Test, TestingModule } from '@nestjs/testing';
import { ConvTemplatesController } from './conv-templates.controller';
import { ConvTemplatesService } from './conv-templates.service';

describe('ConvTemplatesController', () => {
  let controller: ConvTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvTemplatesController],
      providers: [ConvTemplatesService],
    }).compile();

    controller = module.get<ConvTemplatesController>(ConvTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
