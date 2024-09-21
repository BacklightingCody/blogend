import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(); // 可以根据需要添加管道
  app.enableCors(); // 配置 CORS
  await app.listen(8000);
}

bootstrap();
