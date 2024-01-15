import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat/chat.controller';
import { AuthzModule } from './authz/authz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './db-modules/room/room.module';
import { PeopleModule } from './db-modules/people/people.module';
import { RoomTemplateModule } from './db-modules/room-template/room-template.module';
import { ClientInfoModule } from './clients-module/client-info/client-info.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ClientDbMiddleware } from './middlewares/client-db.middleware';
import { ChatModule } from './db-modules/chat/chat.module';
import { ChatEngineModule } from './chat-engine/chat-engine.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { OpenAIService } from './open-ai/open-ai.service';
import { MySlackModule } from './my-slack/my-slack.module';

dotenv.config();

@Module({
  imports: [
    AuthzModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'chatbot_clients',
      connectionName: 'clientsConnection',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionName: 'dbConnection',
    }),

    ConfigModule.forRoot(),
    ClientInfoModule,
    RoomModule,
    RoomTemplateModule,
    PeopleModule,
    ChatModule,
    ChatEngineModule,
    OpenAiModule,
    MySlackModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, OpenAIService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientDbMiddleware).forRoutes('api/*');
  }
}
