import { Module } from '@nestjs/common';
import { ClientInfoService } from './client-info.service';
import { ClientInfoController } from './client-info.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client-info.entity';
import { ClientContextService } from '../../services/client-context.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Client.name, schema: ClientSchema }],
      'clientsConnection',
    ),
  ],
  controllers: [ClientInfoController],
  providers: [ClientInfoService, ClientContextService],
  exports: [ClientInfoService, ClientContextService],
})
export class ClientInfoModule {}
