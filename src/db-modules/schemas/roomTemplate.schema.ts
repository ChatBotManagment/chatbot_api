import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, Model, model } from 'mongoose';
import { Base, BaseModel, BaseSchema } from './base.schema';
import { Room } from './room.schema';

export type roomTemplatesDocument = HydratedDocument<RoomTemplate>;

export const tableName = 'room_templates';

@Schema()
export class RoomTemplate extends Base {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  group: string;

  @Prop()
  groupSlug: string;

  @Prop()
  prompt: string;

  @Prop()
  defaultParties: number[];

  @Prop({ type: [Object] })
  bots: any[];

  @Prop()
  memory: string;

  @Prop({ type: Object })
  metaData: any;

  @Prop()
  createdBy: string;
}

export const roomTemplatesSchema = BaseSchema.clone();
/*  SchemaFactory.createForClass(RoomTemplate).set(
  'timestamps',
  true,
);*/

export const RoomTemplateModel: (connection: Connection) => Model<RoomTemplate> = (
  connection: Connection,
) => BaseModel(connection, tableName) as any;


/*export const RoomTemplateModel = (connection: Connection) => {
  return model<RoomTemplate>(
    RoomTemplate.name,
    roomTemplatesSchema,
    tableName || `${RoomTemplate.name.toLowerCase()}s`,
    {
      overwriteModels: true,
      connection: connection,
    },
  );
};*/
