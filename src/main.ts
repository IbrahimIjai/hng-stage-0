import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new HttpExceptionFilter());

  // Bind to 0.0.0.0 so both WSL and Windows can access it easily!
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
