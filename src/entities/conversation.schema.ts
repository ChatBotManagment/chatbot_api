import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop({ type: Object })
  configuration: any;

  @Prop()
  title: string;

  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: [Object] })
  conversation: any[];

  @Prop({ type: [Object] })
  parties: any[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
