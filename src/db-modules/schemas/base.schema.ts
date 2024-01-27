import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, model } from 'mongoose';

const asd = 'asd';

@Schema()
export class Base {
  // You can define common properties here if needed
}

export const BaseSchema = SchemaFactory.createForClass(Base).set('timestamps', true);

BaseSchema.post('save', function (doc) {
  console.log('------ A document was saved');
  // here how to  inject ClientsService instance
});

BaseSchema.post('find', function (docs) {
  console.log('------ Documents were found');
});

BaseSchema.post('updateOne', function (doc) {
  console.log('------ A document was updated');
});

BaseSchema.post('deleteOne', function (doc) {
  console.log('A document was removed:');
});

export const BaseModel = (connection: Connection, tableName?: string) => {
  return model(Base.name, BaseSchema, tableName || `${Base.name.toLowerCase()}s`, {
    overwriteModels: true,
    connection: connection,
  });
};
