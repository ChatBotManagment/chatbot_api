import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello1(@Body() body: any): string {
    return this.appService.getHello(body);
  }

  @Post()
  getHello(@Param() body: any): string {
    return this.appService.getHello(body);
  }
}
