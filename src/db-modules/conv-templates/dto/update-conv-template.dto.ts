import { PartialType } from '@nestjs/mapped-types';
import { CreateConvTemplateDto } from './create-conv-template.dto';

export class UpdateConvTemplateDto extends PartialType(CreateConvTemplateDto) {}
