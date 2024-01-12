import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People } from '../entities/people.schema';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(People.name)
    private readonly conversationModel: Model<People>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const createdPerson =
      await this.conversationModel.create(createPersonDto);
    return createdPerson;
  }

  async findAll() {
    return await this.conversationModel.find().exec();
  }

  async findOne(id: number) {
    return await this.conversationModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person ${updatePersonDto}`;
  }

  async remove(id: number) {
    const deletedCat = await (this.conversationModel as any)
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
