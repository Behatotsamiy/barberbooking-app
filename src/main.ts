import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import e from 'express';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
    new ValidationPipe  ({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // Временно отключаем для отладки
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log('🚨 Validation errors:', JSON.stringify(errors, null, 2));
        return new BadRequestException({
          message: 'Validation failed',
          errors: errors.map(error => ({
            field: error.property,
            value: error.value,
            constraints: error.constraints,
            children: error.children
          }))
        });
      }
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
