import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, model } from 'mongoose';

export type clientUsersDocument = HydratedDocument<ClientUser>;

export const tableName = 'users';

@Schema()
export class ClientUser {
  @Prop()
  name: string;

  @Prop({ type: [String] })
  credentialIds: string[];

  @Prop()
  roles: string;

  @Prop()
  permissions: string;

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

export const ClientUserSchema = SchemaFactory.createForClass(ClientUser).set(
  'timestamps',
  true,
);
export const ItemModel = (connection: Connection) => {
  return model<ClientUser>(
    ClientUser.name,
    ClientUserSchema,
    tableName || `${ClientUser.name}s`,
    {
      overwriteModels: true,
      connection: connection,
    },
  );
};
