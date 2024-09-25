import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser'; //引入cookie-parser
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v0'); //设置全局路由公共前缀
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(); // 可以根据需要添加管道
  app.enableCors(); // 配置 CORS
  app.use(cookieParser());
  await app.listen(8000);
}

bootstrap();
