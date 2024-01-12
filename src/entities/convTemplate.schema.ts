import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type convTemplatesDocument = HydratedDocument<ConvTemplate>;

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
}

export const convTemplatesSchema = SchemaFactory.createForClass(ConvTemplate);
