import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ClientUser, ItemModel } from '../entities/client-user.entity';
import { CreateClientUserDto } from '../dto/create-user-info.dto';
import { UpdateClientUserDto } from '../dto/update-user-info.dto';

@Injectable()
export class ClientUsersService {
  itemModel: Model<ClientUser>;

  constructor(@InjectConnection('clientsConnection') private connection: Connection) {
    this.itemModel = ItemModel(this.connection);
  }

  async create(createClientUserDto: CreateClientUserDto) {
    return await this.itemModel.create(createClientUserDto);
  }

  async findAll() {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string) {
    try {
      console.log(`ObjectId('${id}')`);
      return await this.itemModel.findById(id).exec();
    } catch (e) {
      return e.message;
    }
  }

  async update(id: string, updateClientUserDto: UpdateClientUserDto) {
    return await this.itemModel
      .findByIdAndUpdate({ _id: id }, updateClientUserDto)
      .exec();
    // return `This action updates a #${id} clientInfo ${updateClientInfoDto}`;
  }

  async remove(id: string) {
    return await this.itemModel.deleteOne({ _id: id }).exec();
  }
}
