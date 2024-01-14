import { Injectable, Scope } from '@nestjs/common';
import { ClientInfoService } from '../clients-module/client-info/client-info.service';
import { Client } from '../clients-module/client-info/entities/client-info.entity';

@Injectable({ scope: Scope.REQUEST })
export class ClientContextService {
  private _dbName: string;
  private _client: Client;

  constructor(private clientService: ClientInfoService) {}

  prefix = 'chbot_';

  set dbName(name: string) {
    this._dbName = name;
  }

  get dbName(): string {
    return this.prefix + this._dbName;
  }

  get client(): Client {
    return this._client;
  }

  async getClient(id: string) {
    const client = await this.clientService.findOne(id);
    this.dbName = client.database;
    this._client = client;
    console.log('dbName', this.dbName);

    return client;
  }
}
