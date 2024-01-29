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
import { RoomTemplateService } from '../services/room-template.service';
import { CreateConvTemplateDto } from '../room-template/dto/create-room-template.dto';
import { UpdateConvTemplateDto } from '../room-template/dto/update-room-template.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/room-template')
export class RoomTemplateController {
  constructor(private readonly roomTemplatesService: RoomTemplateService) {}

  @Post()
  create(@Body() createConvTemplateDto: CreateConvTemplateDto, @Req() req: Request) {
    return this.roomTemplatesService.create(createConvTemplateDto, (req as any).user);
  }

  @Post()
  createFromPerson(@Body() createConvTemplateDto: any, @Req() req: Request) {
    if (!createConvTemplateDto.personTemplateId)
      throw new HttpException('personTemplateId is Required', HttpStatus.BAD_REQUEST);

    return this.roomTemplatesService.createFromPerson(
      createConvTemplateDto,
      (req as any).user,
    );
  }

  @Get()
  findAll() {
    return this.roomTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomTemplatesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConvTemplateDto: UpdateConvTemplateDto) {
    return this.roomTemplatesService.update(id, updateConvTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomTemplatesService.remove(id);
  }
}
