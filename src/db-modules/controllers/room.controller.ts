import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { UpdateRoomDto } from '../room/dto/update-room.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    try {
      return this.roomService.create(createRoomDto, (req as any).user);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  @Get()
  findAll() {
    try {
      return this.roomService.findAll();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
