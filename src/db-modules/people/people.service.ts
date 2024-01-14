import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
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
  ) {
    console.log('dbName', this.clientContextService.dbName);
    this.connection = this.connection.useDb(this.clientContextService.dbName);

    this.peopleModel = PeopleModel(this.connection);
  }

  async create(createPersonDto: CreatePersonDto, user: any) {
    return await this.peopleModel.create({ ...createPersonDto, createdBy: user.sub });
  }

  async findAll() {
    return await this.peopleModel.find().exec();
  }

  async findOne(id: number) {
    return await this.peopleModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    return await this.peopleModel.findByIdAndUpdate({ _id: id }, updatePersonDto).exec();
  }

  async remove(id: number) {
    return await(this.peopleModel as any)
      .findByIdAndRemove({ _id: id })
      .exec();
  }
}
