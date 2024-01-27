import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UseWalletInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`After... ${Date.now() - now}ms`);

        const controllerName = context.getClass().name;
        const handlerName = context.getHandler().name;

        console.log(`Database: ${controllerName}`);
        console.log(`Collection: ${handlerName}`);
      }),
    );
  }
}
