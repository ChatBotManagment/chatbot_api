import { Test, TestingModule } from '@nestjs/testing';
import { MySlackService } from './my-slack.service';

describe('SlackService', () => {
  let service: MySlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MySlackService],
    }).compile();

    service = module.get<MySlackService>(MySlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
