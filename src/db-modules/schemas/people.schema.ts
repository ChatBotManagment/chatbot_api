import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model } from 'mongoose';

export type PeopleDocument = HydratedDocument<People>;

export const tableName = 'people';

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
      connection: connection,
    },
  );
};
