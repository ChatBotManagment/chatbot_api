import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PeopleDocument = HydratedDocument<People>;

@Schema()
export class People {
  @Prop()
  name: string;

  @Prop()
  type: 'user' | 'bot';

  @Prop()
  gender: string;

  @Prop()
  age: string;

  @Prop()
  profilePic: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  metaData: any;
}

export const PeopleSchema = SchemaFactory.createForClass(People);
