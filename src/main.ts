import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { UseWalletInterceptor } from './middlewares/useWallet.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalInterceptors(new UseWalletInterceptor());
  await app.listen(3500);
}
bootstrap();
