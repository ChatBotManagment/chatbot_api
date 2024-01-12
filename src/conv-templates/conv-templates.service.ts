import { Injectable } from '@nestjs/common';
import { CreateConvTemplateDto } from './dto/create-conv-template.dto';
import { UpdateConvTemplateDto } from './dto/update-conv-template.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConvTemplate } from '../entities/convTemplate.schema';

@Injectable()
export class ConvTemplatesService {
  constructor(
    @InjectModel(ConvTemplate.name)
    private readonly convTemplateModel: Model<ConvTemplate>,
  ) {}

  async create(createConvTemplateDto: CreateConvTemplateDto) {
    return await this.convTemplateModel.create(createConvTemplateDto);
  }

  async findAll() {
    return await this.convTemplateModel.find().exec();
  }

  async findOne(id: number) {
    return await this.convTemplateModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updateConvTemplateDto: UpdateConvTemplateDto) {
    return `This action updates a #${id} conversation ${updateConvTemplateDto}`;
  }

  async remove(id: number) {
    return await (this.convTemplateModel as any)
      .findByIdAndRemove({ _id: id })
      .exec();
  }
}
