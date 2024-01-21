import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from '../people/dto/create-person.dto';
import { UpdatePersonDto } from '../people/dto/update-person.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { People, PeopleModel } from '../schemas/people.schema';
import { ClientContextService } from '../../services/client-context.service';

@Injectable()
export class PeopleService {
  private peopleModel: Model<People>;

  constructor(
    @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {}

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.connection = this.connection.useDb(dbName || this.clientContextService.dbName);
      this.peopleModel = PeopleModel(this.connection);
    } else {
      throw new Error('No database name provided');
    }
  }

  async create(createPersonDto: CreatePersonDto, user: any) {
    this.initConnection();

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

  async remove(id: number) {
    this.initConnection();

    return await(this.peopleModel as any)
      .findByIdAndRemove({ _id: id })
      .exec();
  }
}
