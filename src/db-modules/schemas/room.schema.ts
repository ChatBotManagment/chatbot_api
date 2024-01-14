import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model } from 'mongoose';
import { Conversation, ConversationSchema } from './conversation.schema';

export type RoomDocument = HydratedDocument<Room>;

export const tableName = 'rooms';

@Schema()
export class Room {
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
export const RoomModel = (connection: Connection) => {
  return model<Room>(Room.name, RoomSchema, tableName || `${Room.name.toLowerCase()}s`, {
    connection: connection,
  });
};
