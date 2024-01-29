import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import * as path from 'path';

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

  @Get('log1')
  serveLogFile(@Res() res: Response): void {
    // Define the path to your log file
    const logFilePath = '/home/ubuntu/.pm2/logs/chatbot-api1-out.log';

    // Serve the log file
    try {
      res.sendFile(path.resolve(logFilePath));
    } catch (e) {
      console.log('Error serving log file: ', e);
    }
  }
  @Get('log2')
  serveLogFile2(@Res() res: Response): void {
    // Define the path to your log file
    const logFilePath = '/home/ubuntu/.pm2/logs/chatbot-api1-error.log';

    // Serve the log file
    try {
      res.sendFile(path.resolve(logFilePath));
    } catch (e) {
      console.log('Error serving log file: ', e);
    }
  }
}
