import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('UseWalletMiddleware', req.body);
    console.log('UseWalletMiddleware', res);
    next();
  }
}
