import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loger = new Logger('bootstrap');
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted is set to true
      // to prevent the use of non-whitelisted properties
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT');
  loger.log(`Server is running on port ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
