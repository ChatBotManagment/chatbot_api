import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInfoDto } from './create-client-info.dto';

export class UpdateClientInfoDto extends PartialType(CreateClientInfoDto) {}
