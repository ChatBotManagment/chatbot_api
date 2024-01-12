import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIService } from './openai/openai.service';
import { ChatController } from './chat/chat.controller';
import { AuthzModule } from './authz/authz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from './db-modules/conversation/conversation.module';
import { PeopleModule } from './db-modules/people/people.module';
import { ConvTemplatesModule } from './db-modules/conv-templates/conv-templates.module';

@Module({
  imports: [
    AuthzModule,
    MongooseModule.forRoot(
      'mongodb+srv://hazem:iIradvWUPIgurVvt@cluster0.v6wnn.mongodb.net/?retryWrites=true&w=majority',
    ),
    ConversationModule,
    PeopleModule,
    ConvTemplatesModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, OpenAIService],
})
export class AppModule {}
