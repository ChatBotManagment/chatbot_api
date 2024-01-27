import { Injectable, Scope } from '@nestjs/common';
import { UpdatePersonDto } from '../people/dto/update-person.dto';
import { Connection, Model } from 'mongoose';
import { People, PeopleModel } from '../schemas/people.schema';
import { ClientContextService } from '../../services/client-context.service';

@Injectable({ scope: Scope.REQUEST })
export class PeopleService {
  private peopleModel: Model<People>;

  connection: Connection;
  constructor(
    // @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {}

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.connection = this.clientContextService.dbConnection;
      this.peopleModel = PeopleModel(this.connection);
    } else {
      throw new Error('No database name provided');
    }
  }

  async create(createPersonDto: any, user: any) {
    this.initConnection();

    console.log('asda--------', createPersonDto);

    console.log('asd', { ...createPersonDto, createdBy: user.sub });
    return await this.peopleModel.create({ ...createPersonDto, createdBy: user.sub });
  }

  async findAll() {
    this.initConnection();

    return await this.peopleModel.find().exec();
  }

  async findOne(id: string) {
    this.initConnection();

    return await this.peopleModel.findOne({ _id: id }).exec();
  }

  async findOneByCredential(credentialId: string) {
    this.initConnection();

    return await this.peopleModel.findOne({ credentialIds: credentialId }).exec();
  }

  async increaseCredit(credentialId: string, additionalCredit: number) {
    this.initConnection();
    const person = await this.peopleModel.findOne({ credentialIds: credentialId }).exec();
    if (person.credit + additionalCredit < 0) throw new Error('Not enough credit');
    const afterUpdated = await this.peopleModel
      .findByIdAndUpdate(
        { _id: person._id },
        { credit: person.credit + additionalCredit },
      )
      .exec();
    return afterUpdated.credit;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    this.initConnection();

    return await this.peopleModel.findByIdAndUpdate({ _id: id }, updatePersonDto).exec();
  }

  async remove(id: string) {
    this.initConnection();

    return await this.peopleModel.deleteOne({ _id: id }).exec();
  }
}
