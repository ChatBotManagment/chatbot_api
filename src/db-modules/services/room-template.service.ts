import { Injectable } from '@nestjs/common';
import { CreateConvTemplateDto } from '../room-template/dto/create-room-template.dto';
import { UpdateConvTemplateDto } from '../room-template/dto/update-room-template.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RoomTemplate, RoomTemplateModel } from '../schemas/roomTemplate.schema';
import { ClientContextService } from '../../services/client-context.service';

@Injectable()
export class RoomTemplateService {
  private roomTemplateModel: Model<RoomTemplate>;

  constructor(
    @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {
    // this.initConnection();
  }

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.connection = this.connection.useDb(dbName || this.clientContextService.dbName);
      this.roomTemplateModel = RoomTemplateModel(this.connection);
    } else {
      throw new Error('No database name provided');
    }
  }

  async create(createConvTemplateDto: CreateConvTemplateDto, user: any) {
    this.initConnection();
    return await this.roomTemplateModel.create({
      ...createConvTemplateDto,
      createdBy: user.sub,
    });
  }

  async findAll() {
    this.initConnection();
    return await this.roomTemplateModel.find().exec();
  }

  async findOne(id: string, dbName?: string) {
    this.initConnection(dbName);

    return await this.roomTemplateModel.findOne<RoomTemplate>({ _id: id }).exec();
  }

  async update(id: string, updateConvTemplateDto: UpdateConvTemplateDto) {
    this.initConnection();
    return `This action updates a #${id} room ${updateConvTemplateDto}`;
  }

  async remove(id: number) {
    this.initConnection();
    return await (this.roomTemplateModel as any).findByIdAndRemove({ _id: id }).exec();
  }
}
