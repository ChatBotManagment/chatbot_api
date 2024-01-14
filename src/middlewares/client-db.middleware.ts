import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientContextService } from '../services/client-context.service';

@Injectable()
export class ClientDbMiddleware implements NestMiddleware {
  constructor(private clientContextService: ClientContextService) {}

  async use(req: Request, res: Response, next: () => void) {
    const clientId = req.headers['client-id'] as string;
    if (clientId) {
      await this.clientContextService.getClient(clientId);
      (req as any).dbName = this.clientContextService.dbName;
    } else {
      throw new HttpException('client-id header is required', HttpStatus.BAD_REQUEST);
    }

    next();
  }
}
