import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import * as YAML from 'yamljs';
import { writeFileSync } from 'fs';
import helmet from 'helmet';
// import { SignResponseMiddleware } from './common/middleware/sign-response.middleware';

// import { GlobalExceptionFilter } from './utils/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  // Only enable CORS in non-development environments
  const corsOptions = {
    origin:
      process.env.NODE_ENV === 'development'
        ? true // Allow all origins in development
        : configService.getOrThrow('app.frontendDomain', { infer: true }),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-network',
    ],
  };

  app.enableCors(corsOptions);

  app.use(helmet());
  // app.use(new SignResponseMiddleware(configService).use);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  // throw new Error(`Failed to upload file:`);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Enable class-transformer globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const optionsBuilder = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0');

  optionsBuilder
    .addServer('https://dev-api.consolideth.app/', 'Development server')
    .addServer('https://api.consolideth.app/', 'Production server')
    .addServer('http://localhost:3000', 'localhost server');

  const options = optionsBuilder
    // .addApiKey({ type: 'apiKey', in: 'header', name: 'X-API-KEY' }, 'X-API-KEY')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // const jsonDocument = JSON.stringify(document, null, 2);
  // // Persist JSON documentation to file
  // const jsonFilePath = './swagger.json'; // You can choose your path
  // writeFileSync(jsonFilePath, jsonDocument, 'utf8');

  // Convert document to YAML
  const yamlDocument = YAML.stringify(document, 10);

  // Persist YAML documentation to file
  const yamlFilePath = './swagger.yaml'; // You can choose your path
  writeFileSync(yamlFilePath, yamlDocument, 'utf8');

  // Setup a route to serve YAML documentation
  app.getHttpAdapter().get('/docs-yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(yamlDocument);
  });

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
