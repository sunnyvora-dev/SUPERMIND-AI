import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global HTTP Security Headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Allows Swagger UI and local development assets
  }));

  // Global Prefix for REST endpoints: /api
  app.setGlobalPrefix('api');

  // Hardened payload limit for standard JSON endpoints (2 MB to prevent memory exhaustion DoS)
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ limit: '2mb', extended: true }));

  // Static Assets Serving for Uploads and Generated Images (/uploads)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

  const port = process.env.PORT || 3000;

  // Configure Swagger API Documentation at /api/docs (Disabled in production unless explicitly enabled)
  if (!isProduction || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('SuperMind AI — Multi-LLM Orchestration Backend API')
      .setDescription('Production-grade NestJS REST API supporting JWT authentication, Supervisor multi-model pipeline, prompt routing, file management, and analytics.')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`Swagger OpenAPI Documentation active on: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`SuperMind AI Backend is running locally on: http://localhost:${port}/api`);
}
bootstrap();
