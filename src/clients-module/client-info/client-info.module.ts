import { Module } from '@nestjs/common';
import { ClientInfoService } from './services/client-info.service';
import { ClientInfoController } from './controllers/client-info.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client-info.entity';
import { ClientContextService } from '../../services/client-context.service';
import { ClientUsersController } from './controllers/client-users.controller';
import { ClientUsersService } from './services/client-users.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Client.name, schema: ClientSchema }],
      'clientsConnection',
    ),
  ],
  controllers: [ClientInfoController, ClientUsersController],
  providers: [ClientInfoService, ClientContextService, ClientUsersService],
  exports: [ClientInfoService, ClientContextService, ClientUsersService],
})
export class ClientInfoModule {}
