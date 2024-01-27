import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientContextService } from '../services/client-context.service';
import * as dotenv from 'dotenv';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';

dotenv.config();

@Injectable()
export class UseWalletMiddleware implements NestMiddleware {
  constructor(
    private clientContextService: ClientContextService,
    private clientInfoService: ClientInfoService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const clientId = req.headers['client-id'];
    // Create a new connection to the client's database
    // req['dbConnection'] = this.clientContextService.dbConnection;
    let value: any = null;
    if (req.method !== 'POST' && req.method !== 'GET') {
      value = {
        amount: -4,
        description: 'Get request',
        metadata: {},
      };
    } else if (req.method === 'POST') {
      value = {
        amount: -5,
        description: 'Post request',
        metadata: {},
      };
    }
    if (value) {
      try {
        const balance = await this.clientInfoService.updateBalance(clientId, value);
        console.log('Balance updated', balance);

        if (balance === -1)
          throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
      } catch (e) {
        if (e instanceof HttpException) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return res.status(e.getStatus()).json({
            status: e.getStatus(),
            error: e.getResponse(),
          });
        } else {
          throw e;
        }
      }
    }

    next();
  }
}
