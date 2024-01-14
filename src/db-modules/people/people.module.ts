import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';

// import { People, PeopleSchema } from '../schemas/people.schema';

@Module({
  /*  imports: [
      MongooseModule.forFeature([{ name: People.name, schema: PeopleSchema }]),
    ],*/
  imports: [ClientInfoModule],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
