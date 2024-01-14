import { ClientDbMiddleware } from './client-db.middleware';

describe('ClientDbMiddleware', () => {
  it('should be defined', () => {
    expect(new ClientDbMiddleware()).toBeDefined();
  });
});
