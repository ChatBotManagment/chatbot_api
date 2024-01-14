import { Injectable } from '@nestjs/common';
import { CreateClientInfoDto } from './dto/create-client-info.dto';
import { UpdateClientInfoDto } from './dto/update-client-info.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Client, ItemModel } from './entities/client-info.entity';

@Injectable()
export class ClientInfoService {
  itemModel: Model<Client>;

  constructor(
    /* @InjectModel(Client.name, 'clientsConnection')
        private readonly itemModel: Model<Client>,*/
    @InjectConnection('clientsConnection') private connection: Connection,
  ) {
    this.itemModel = ItemModel(connection);
  }

  async create(createClientInfoDto: CreateClientInfoDto) {
    return await this.itemModel.create(createClientInfoDto);
  }

  async findAll() {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string) {
    return await this.itemModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updateClientInfoDto: UpdateClientInfoDto) {
    return `This action updates a #${id} clientInfo ${updateClientInfoDto}`;
  }

  async remove(id: number) {
    return await (this.itemModel as any).findByIdAndRemove({ _id: id }).exec();
  }
}
