import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { Prop } from '@nestjs/mongoose';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  s;
}
