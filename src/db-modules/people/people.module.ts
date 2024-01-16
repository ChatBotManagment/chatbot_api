import { Module } from '@nestjs/common';
import { PeopleService } from '../services/people.service';
import { PeopleController } from '../controllers/people.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';


@Module({
  imports: [ClientInfoModule],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
