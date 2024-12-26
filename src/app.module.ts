import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/auth/auth.module';
import { TestModule } from '@/feature/test/test.module';
import { UsersModule } from '@/feature/users/users.module';
import { CommentsModule } from '@/feature/comments/comments.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptors';
import { PrismaModule } from '@/prisma.module';
export const IS_DEV = process.env.RUNNING_ENV !== 'prod';
const envFilePath = ['.env'];

if (IS_DEV) {
  envFilePath.unshift('.env.dev');
} else {
  envFilePath.unshift('.env.prod');
}

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TestModule,
    UsersModule,
    CommentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      // load: [configuration], // 加载配置文件
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
