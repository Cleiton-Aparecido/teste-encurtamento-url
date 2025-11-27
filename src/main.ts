import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  await app.listen(process.env.PORT, '0.0.0.0');
  Logger.log(
    `Servidor rodando em ${process.env.BASE_URL || 'http://localhost'}:${process.env.PORT}`,
  );
}
bootstrap();
