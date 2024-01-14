import { Test, TestingModule } from '@nestjs/testing';
import { ChatEngineService } from './chat-engine.service';

describe('ChatEngineService', () => {
  let service: ChatEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatEngineService],
    }).compile();

    service = module.get<ChatEngineService>(ChatEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Development', () => {
    service.getReply({ message: '', role: '' });
    expect(5).toEqual(5);
  });
});
