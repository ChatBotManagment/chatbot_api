import { Injectable, Scope } from '@nestjs/common';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { UpdateRoomDto } from '../room/dto/update-room.dto';
import { Connection, Model, Types } from 'mongoose';
import { ClientContextService } from '../../services/client-context.service';
import { Room, RoomModel } from '../schemas/room.schema';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { RoomTemplateService } from './room-template.service';

@Injectable({ scope: Scope.REQUEST })
export class RoomService {
  private roomModel: Model<Room>;
  connection: Connection;

  constructor(
    // @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
    private roomTemplateService: RoomTemplateService,
  ) {}

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.roomModel = RoomModel(this.clientContextService.dbConnection);
    } else {
      throw new Error('No database name provided');
    }
  }

  async createFromTemplate(
    roomTemplateId: string,
    createRoomDto: CreateRoomDto,
    user: any,
  ) {
    const roomTemplate = await this.roomTemplateService.findOne(roomTemplateId);
    if (!roomTemplate) throw new Error('No room template found');
    const sd = JSON.stringify(roomTemplate);
    const sd1 = JSON.parse(sd);

    createRoomDto.configuration = { ...sd1 };
    createRoomDto.configuration = { roomTemplateId: roomTemplateId, ...sd1 };
    return await this.create(createRoomDto, user);
  }

  async create(createRoomDto: CreateRoomDto, user: any) {
    this.initConnection();
    return await this.roomModel.create({ ...createRoomDto, createdBy: user.sub });
  }

  async addChat(roomId: string, commentDto: CreateChatDto): Promise<Room> {
    this.initConnection();
    const comment = { ...commentDto, _id: new Types.ObjectId() };
    try {
      return await this.roomModel
        .findByIdAndUpdate(roomId, { $push: { conversation: comment } }, { new: true })
        .exec();
    } catch (e) {
      console.log('error', e.message);
      return null;
    }
  }

  async findAll() {
    this.initConnection();
    return await this.roomModel.find().exec();
  }

  async findOne(id: string) {
    this.initConnection();
    return await this.roomModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    this.initConnection();
    return this.roomModel.updateOne({ _id: id }, updateRoomDto);
  }

  async remove(id: string) {
    this.initConnection();
    return await this.roomModel.deleteOne({ _id: id }).exec();
  }
}
