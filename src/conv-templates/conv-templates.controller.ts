import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConvTemplatesService } from './conv-templates.service';
import { CreateConvTemplateDto } from './dto/create-conv-template.dto';
import { UpdateConvTemplateDto } from './dto/update-conv-template.dto';

@Controller('conv-templates')
export class ConvTemplatesController {
  constructor(private readonly convTemplatesService: ConvTemplatesService) {}

  @Post()
  create(@Body() createConvTemplateDto: CreateConvTemplateDto) {
    return this.convTemplatesService.create(createConvTemplateDto);
  }

  @Get()
  findAll() {
    return this.convTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.convTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConvTemplateDto: UpdateConvTemplateDto) {
    return this.convTemplatesService.update(+id, updateConvTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.convTemplatesService.remove(+id);
  }
}
