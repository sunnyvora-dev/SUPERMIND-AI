import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Prefix for REST endpoints: /api
  app.setGlobalPrefix('api');

  // Increase payload limit for large document uploads (50 MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Strict CORS Configuration (Restricted Origins in Production)


  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

  app.enableCors({
    origin: isProduction ? allowedOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With,Accept',
    credentials: true,
  });


  // Global Exception Handling & DTO Validation
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configure Swagger API Documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('SuperMind AI — Multi-LLM Orchestration Backend API')
    .setDescription('Production-grade NestJS REST API supporting JWT authentication, Supervisor multi-model pipeline, prompt routing, file management, and analytics.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`SuperMind AI Backend is running locally on: http://localhost:${port}/api`);
  logger.log(`Swagger OpenAPI Documentation active on: http://localhost:${port}/api/docs`);
}
bootstrap();
