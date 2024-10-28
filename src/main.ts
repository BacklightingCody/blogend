import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser'; //引入cookie-parser
import { AppModule, IS_DEV } from './app.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v0'); //设置全局路由公共前缀
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(); // 可以根据需要添加管道
  app.enableCors(); // 配置 CORS
  app.use(cookieParser());
  console.log(`Port: ${PORT}`, IS_DEV);
  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
