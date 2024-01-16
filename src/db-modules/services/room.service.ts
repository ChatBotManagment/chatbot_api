import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { UpdateRoomDto } from '../room/dto/update-room.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ClientContextService } from '../../services/client-context.service';
import { Room, RoomModel } from '../schemas/room.schema';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { PeopleModel } from '../schemas/people.schema';

@Injectable()
export class RoomService {
  private roomModel: Model<Room>;

  constructor(
    @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {}

  private initConnection(dbName?: string) {
    if (dbName || this.clientContextService.dbName) {
      this.connection = this.connection.useDb(dbName || this.clientContextService.dbName);
      this.roomModel = RoomModel(this.connection);
    } else {
      throw new Error('No database name provided');
    }
  }

  async create(createRoomDto: CreateRoomDto, user: any) {
    this.initConnection();
    return await this.roomModel.create({ ...createRoomDto, createdBy: user.sub });
  }

  async addChat(postId: string, commentDto: CreateChatDto): Promise<any> {
    this.initConnection();
    const comment = { ...commentDto, _id: new Types.ObjectId() };
    try {
      return await this.roomModel
        .findByIdAndUpdate(postId, { $push: { conversation: comment } }, { new: true })
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

  update(id: number, updateRoomDto: UpdateRoomDto) {
    this.initConnection();
    return `This action updates a #${id} room ${updateRoomDto}`;
  }

  async remove(id: number) {
    this.initConnection();
    return await (this.roomModel as any).findByIdAndRemove({ _id: id }).exec();
  }
}
