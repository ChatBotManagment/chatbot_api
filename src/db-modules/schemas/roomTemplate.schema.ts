import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model } from 'mongoose';

export type roomTemplatesDocument = HydratedDocument<ConvTemplate>;

export const tableName = 'room_templates';

@Schema()
export class ConvTemplate {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  group: string;

  @Prop()
  groupSlug: string;

  @Prop()
  Prompt: string;

  @Prop()
  defaultParties: number[];

  @Prop()
  memory: string;

  @Prop({ type: Object })
  metaData: any;

  @Prop()
  createdBy: string;
}

export const roomTemplatesSchema = SchemaFactory.createForClass(ConvTemplate).set(
  'timestamps',
  true,
);

export const ConvTemplateModel = (connection: Connection) => {
  return model<ConvTemplate>(
    ConvTemplate.name,
    roomTemplatesSchema,
    tableName || `${ConvTemplate.name.toLowerCase()}s`,
    {
      connection: connection,
    },
  );
};
