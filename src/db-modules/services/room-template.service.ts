import { Injectable, Scope } from '@nestjs/common';
import { CreateConvTemplateDto } from '../room-template/dto/create-room-template.dto';
import { UpdateConvTemplateDto } from '../room-template/dto/update-room-template.dto';
import { Connection, Model } from 'mongoose';
import { RoomTemplate, RoomTemplateModel } from '../schemas/roomTemplate.schema';
import { ClientContextService } from '../../services/client-context.service';

@Injectable({ scope: Scope.REQUEST })
export class RoomTemplateService {
  private roomTemplateModel: Model<RoomTemplate>;
  connection: Connection;

  constructor(
    // @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {
    // this.initConnection();
  }

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.connection = this.clientContextService.dbConnection;
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
    return await this.roomTemplateModel
      .findByIdAndUpdate({ _id: id }, updateConvTemplateDto)
      .exec();
  }

  async remove(id: string) {
    this.initConnection();
    return await(this.roomTemplateModel as any)
      .deleteOne({ _id: id })
      .exec();
  }
}
