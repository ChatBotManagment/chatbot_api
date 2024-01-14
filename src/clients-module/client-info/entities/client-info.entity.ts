import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model } from 'mongoose';

export type RoomDocument = HydratedDocument<Client>;

export const tableName = 'clients';

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  secret: string;

  @Prop()
  database: string;

  @Prop()
  url: string;

  @Prop()
  openai_api_key: string;

  @Prop()
  openai_organization: string;

  @Prop({ type: Object })
  metadata: any;
}

export const ClientSchema = SchemaFactory.createForClass(Client).set('timestamps', true);
export const ItemModel = (connection: Connection) => {
  return model<Client>(Client.name, ClientSchema, tableName || `${Client.name}s`, {
    connection: connection,
  });
};
