import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientInfoDto } from '../dto/create-client-info.dto';
import { UpdateClientInfoDto } from '../dto/update-client-info.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Client, ItemModel } from '../entities/client-info.entity';

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
    try {
      return await this.itemModel.findById<Client>(id).exec();
    } catch (e) {
      return e.message;
    }
  }

  async update(id: string, updateClientInfoDto: UpdateClientInfoDto) {
    return await this.itemModel
      .findByIdAndUpdate({ _id: id }, updateClientInfoDto)
      .exec();
    // return `This action updates a #${id} clientInfo ${updateClientInfoDto}`;
  }

  async remove(id: string) {
    return await this.itemModel.deleteOne({ _id: id }).exec();
  }

  async updateBalance(
    id: string,
    value: { amount: number; description: string; metadata: any },
  ) {
    const client = await this.itemModel.findById({ _id: id }).exec();
    if (Number(value.amount) < 0 && client?.wallet <= 0) return -1;
    // throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);

    if (client) {
      const wallet = client.wallet || 0;
      client.wallet = (client.wallet || 0) + Number(value.amount);
      client.walletLog.push({
        amount: value.amount,
        previousBalance: wallet,
        walletBalance: client.wallet,
        description: value.description,
        metadata: value.metadata,
        date: new Date(),
      });
    }
    await client.save();
    return client.wallet;
  }
}
