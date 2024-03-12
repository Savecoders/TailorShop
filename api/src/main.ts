import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(PORT);
}
bootstrap();
