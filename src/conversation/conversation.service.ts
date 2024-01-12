import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../entities/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const createdConversation = await this.conversationModel.create(
      createConversationDto,
    );
    return createdConversation;
  }

  async findAll() {
    return await this.conversationModel.find().exec();
  }

  async findOne(id: number) {
    return await this.conversationModel.findOne({ _id: id }).exec();
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation ${updateConversationDto}`;
  }

  async remove(id: number) {
    const deletedCat = await (this.conversationModel as any)
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
