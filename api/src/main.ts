import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  const configDocumentBuilder = new DocumentBuilder()
    .setTitle('TailorShop Brands Rest API')
    .setDescription('TailorShop Endpoint API for Products')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configDocumentBuilder);
  SwaggerModule.setup('api', app, document);

  loger.log(`Server is running on port ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
