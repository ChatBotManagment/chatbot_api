import { PartialType } from '@nestjs/mapped-types';
import { CreateConvTemplateDto } from './create-room-template.dto';

export class UpdateConvTemplateDto extends PartialType(CreateConvTemplateDto) {}
