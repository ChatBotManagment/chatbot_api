import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('LogMiddleware_req.body', req.body);
    console.log('LogMiddleware_res', res.body);
    next();
  }
}
