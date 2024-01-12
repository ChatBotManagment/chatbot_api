import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { Prop } from "@nestjs/mongoose";

export class UpdateConversationDto extends PartialType(CreateConversationDto) {s}
