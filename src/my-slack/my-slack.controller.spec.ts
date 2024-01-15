import { Test, TestingModule } from '@nestjs/testing';
import { MySlackController } from './my-slack.controller';

describe('SlackController', () => {
  let controller: MySlackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySlackController],
    }).compile();

    controller = module.get<MySlackController>(MySlackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
