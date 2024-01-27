import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, Model, model } from 'mongoose';
import { Base, BaseModel } from './base.schema';
import { RoomTemplate } from './roomTemplate.schema';

export type PeopleDocument = HydratedDocument<People>;

export const tableName = 'people';

@Schema()
export class People extends Base {
  @Prop()
  name: string;

  @Prop()
  type: 'user' | 'bot';

  @Prop({ type: [String] })
  credentialIds: string[];

  @Prop()
  gender: string;

  @Prop()
  age: string;

  @Prop()
  profilePic: string;

  @Prop()
  description: string;

  @Prop()
  credit: number;

  @Prop({ type: [Object] })
  creditLog: any[];

  @Prop({ type: Object })
  metaData: any;

  @Prop()
  createdBy: string;
}

export const PeopleSchema = SchemaFactory.createForClass(People).set('timestamps', true);


export const PeopleModel = (connection: Connection) => {
  return model<People>(
    People.name,
    PeopleSchema,
    tableName || `${People.name.toLowerCase()}s`,
    {
      overwriteModels: true,
      connection: connection,
    },
  );
};
