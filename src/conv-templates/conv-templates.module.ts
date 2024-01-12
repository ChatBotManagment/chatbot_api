import { Module } from '@nestjs/common';
import { ConvTemplatesService } from './conv-templates.service';
import { ConvTemplatesController } from './conv-templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConvTemplate,
  convTemplatesSchema,
} from '../entities/convTemplate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConvTemplate.name, schema: convTemplatesSchema },
    ]),
  ],
  controllers: [ConvTemplatesController],
  providers: [ConvTemplatesService],
})
export class ConvTemplatesModule {}
