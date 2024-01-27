import { Injectable, Scope } from '@nestjs/common';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';
import { Client } from '../clients-module/client-info/entities/client-info.entity';
import mongoose, { Connection } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class ClientContextService {
  private _dbName: string;
  private _client: Client;
  public dbConnection: Connection;

  constructor(private clientService: ClientInfoService) {}

  prefix = 'chbot_';
  clientId: string = null;

  set dbName(name: string) {
    this._dbName = name;
  }

  get dbName(): string {
    return this._dbName ? this.prefix + this._dbName : undefined;
  }

  get client(): Client {
    return this._client;
  }

  async getClient(id: string) {
    this.clientId = id;
    const client = await this.clientService.findOne(id);
    if (!client) {
      throw new Error('Client not found');
    }
    this.dbName = client.database;
    this._client = client;
    this.dbConnection = mongoose.createConnection(process.env.MONGO_URI, {
      dbName: this.dbName,
    });
    // console.debug('dbConnection-$dbName', this.dbConnection['$dbName']);
    console.debug('dbName__', this.dbName);

    return client;
  }
}
