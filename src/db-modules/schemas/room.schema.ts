import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model, Model } from 'mongoose';
import { Conversation, ConversationSchema } from './conversation.schema';
import { Base, BaseModel, BaseSchema } from './base.schema';

export type RoomDocument = HydratedDocument<Room>;

export const tableName = 'rooms';

@Schema()
export class Room extends Base {
  _id: string;

  @Prop({ type: Object })
  configuration: any;

  @Prop()
  title: string;

  @Prop({ type: [ConversationSchema] })
  conversation: Conversation[];

  @Prop({ type: [Object] })
  parties: any[];

  @Prop()
  createdBy: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room).set('timestamps', true);
// export const RoomSchema = BaseSchema.clone();
export const RoomModel = (connection: Connection) => {
  return model<Room>(Room.name, RoomSchema, tableName || `${Room.name.toLowerCase()}s`, {
    overwriteModels: true,
    connection: connection,
  });
};

// export const RoomModel: (connection: Connection) => Model<Room> = (
//   connection: Connection,
// ) => BaseModel(connection, tableName) as any;
