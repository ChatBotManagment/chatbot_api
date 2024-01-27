import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from './base.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

export const tableName = 'rooms';

@Schema()
export class Conversation extends Base {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String })
  content: any;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  role: string;

  @Prop({ type: Object })
  metaData: any;

  @Prop({ type: String })
  read_by: any;

  @Prop({ type: String })
  createdBy: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)
  .set('timestamps', true)
  .set('_id', true);
