import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ClientContextService } from '../../services/client-context.service';
import { Room, RoomModel } from '../schemas/room.schema';
import { CreateChatDto } from '../chat/dto/create-chat.dto';

@Injectable()
export class RoomService {
  private roomModel: Model<Room>;

  constructor(
    @InjectConnection('dbConnection') private connection: Connection,
    private clientContextService: ClientContextService,
  ) {
    this.connection = this.connection.useDb(this.clientContextService.dbName);
    this.roomModel = RoomModel(this.connection);
  }

  async create(createRoomDto: CreateRoomDto, user: any) {
    return await this.roomModel.create({ ...createRoomDto, createdBy: user.sub });
  }

  async addChat(postId: string, commentDto: CreateChatDto): Promise<any> {
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
    return await this.roomModel.find().exec();
  }

  async findOne(id: string) {
    return await this.roomModel.findOne({ _id: id }).exec();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room ${updateRoomDto}`;
  }

  async remove(id: number) {
    return await (this.roomModel as any).findByIdAndRemove({ _id: id }).exec();
  }
}
