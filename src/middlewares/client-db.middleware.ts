import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientContextService } from '../services/client-context.service';
import * as dotenv from 'dotenv';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';

dotenv.config();

@Injectable()
export class ClientDbMiddleware implements NestMiddleware {
  constructor(
    private clientContextService: ClientContextService,
    private clientInfoService: ClientInfoService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('ClientDbMiddleware', req.headers['client-id']);
    const clientId = req.headers['client-id'];
    await this.clientContextService.getClient(clientId);

    next();
  }
}
