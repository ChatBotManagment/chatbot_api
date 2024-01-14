import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientInfoService } from './client-info.service';
import { CreateClientInfoDto } from './dto/create-client-info.dto';
import { UpdateClientInfoDto } from './dto/update-client-info.dto';

@Controller('client-info')
export class ClientInfoController {
  constructor(private readonly clientInfoService: ClientInfoService) {}

  @Post()
  create(@Body() createClientInfoDto: CreateClientInfoDto) {
    return this.clientInfoService.create(createClientInfoDto);
  }

  @Get()
  findAll() {
    return this.clientInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientInfoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientInfoDto: UpdateClientInfoDto) {
    return this.clientInfoService.update(+id, updateClientInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientInfoService.remove(+id);
  }
}
