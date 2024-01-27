import { PartialType } from '@nestjs/mapped-types';
import { CreateClientUserDto } from './create-user-info.dto';

export class UpdateClientUserDto extends PartialType(CreateClientUserDto) {}
