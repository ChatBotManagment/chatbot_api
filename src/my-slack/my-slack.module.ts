import { Module } from '@nestjs/common';
import { MySlackController } from './my-slack.controller';
import { MySlackService } from './my-slack.service';
import { OpenAiModule } from '../open-ai/open-ai.module';

@Module({
  imports: [OpenAiModule],
  controllers: [MySlackController],
  providers: [MySlackService],
})
export class MySlackModule {}
