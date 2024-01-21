import { Module } from '@nestjs/common';
import { OpenAIService } from './open-ai.service';
import { ClientInfoModule } from '../clients-module/client-info/client-info.module';

@Module({
  imports: [ClientInfoModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAiModule {}
