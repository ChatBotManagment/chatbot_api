import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateClientUserDto } from '../dto/create-user-info.dto';
import { UpdateClientUserDto } from '../dto/update-user-info.dto';
import { ClientUsersService } from '../services/client-users.service';

@Controller('client-User')
export class ClientUsersController {
  constructor(private readonly clientUserService: ClientUsersService) {}

  @Post()
  create(@Body() createClientUserDto: CreateClientUserDto) {
    return this.clientUserService.create(createClientUserDto);
  }

  @Get()
  findAll() {
    return this.clientUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.clientUserService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientUserDto: UpdateClientUserDto) {
    return this.clientUserService.update(id, updateClientUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientUserService.remove(id);
  }
}
