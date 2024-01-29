import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { CreateConvTemplateDto } from '../room-template/dto/create-room-template.dto';
import { UpdateConvTemplateDto } from '../room-template/dto/update-room-template.dto';
import { Connection, Model } from 'mongoose';
import { RoomTemplate, RoomTemplateModel } from '../schemas/roomTemplate.schema';
import { ClientContextService } from '../../services/client-context.service';
import { PeopleService } from './people.service';

@Injectable({ scope: Scope.REQUEST })
export class RoomTemplateService {
  private roomTemplateModel: Model<RoomTemplate>;
  connection: Connection;

  constructor(
    // @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
    private peopleService: PeopleService,
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

  async create(body: CreateConvTemplateDto | any, user: any) {
    this.initConnection();
    if (!body.personTemplateId) {
      return await this.roomTemplateModel.create({
        ...body,
        createdBy: user.sub,
      });
    } else {
      const person = await this.peopleService.findOne(body.personTemplateId);
      if (person)
        return await this.roomTemplateModel.create({
          ...body,
          prompt: person.description + ' \n ' + body.prompt,
          bots: [person],
          createdBy: user.sub,
        });
      else throw new HttpException('no person with this Id', HttpStatus.NOT_FOUND);
    }
  }

  async createFromPerson(body: any, user) {
    this.initConnection();
    const person: any = await this.peopleService.findOne(body.personTemplateId);
    if (person)
      return await this.roomTemplateModel.create({
        ...body,
        prompt: person.description + ' \n ' + body.prompt,
        bots: body.bots?.length ? body.bots.push(person.bots) : [person.bots],
        createdBy: user.sub,
      });
  }

  async findAll() {
    this.initConnection();
    return await this.roomTemplateModel.find().exec();
  }

  async findOne(id: string, dbName?: string) {
    this.initConnection(dbName);

    return await this.roomTemplateModel.findById<RoomTemplate>(id).exec();
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
