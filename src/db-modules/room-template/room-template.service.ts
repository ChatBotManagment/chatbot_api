import { Injectable } from '@nestjs/common';
import { CreateConvTemplateDto } from './dto/create-room-template.dto';
import { UpdateConvTemplateDto } from './dto/update-room-template.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ConvTemplate, ConvTemplateModel } from '../schemas/roomTemplate.schema';
import { ClientContextService } from '../../services/client-context.service';

@Injectable()
export class RoomTemplateService {
  private roomTemplateModel: Model<ConvTemplate>;

  constructor(
    @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {
    this.connection = this.connection.useDb(this.clientContextService.dbName);
    this.roomTemplateModel = ConvTemplateModel(this.connection);
  }

  async create(createConvTemplateDto: CreateConvTemplateDto, user: any) {
    return await this.roomTemplateModel.create({
      ...createConvTemplateDto,
      createdBy: user.sub,
    });
  }

  async findAll() {
    return await this.roomTemplateModel.find().exec();
  }

  async findOne(id: number) {
    return await this.roomTemplateModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updateConvTemplateDto: UpdateConvTemplateDto) {
    return `This action updates a #${id} room ${updateConvTemplateDto}`;
  }

  async remove(id: number) {
    return await (this.roomTemplateModel as any).findByIdAndRemove({ _id: id }).exec();
  }
}
