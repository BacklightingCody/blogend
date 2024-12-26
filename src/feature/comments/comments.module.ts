// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from '@/prisma.module';

@Module({
  imports: [PrismaModule], // 引入 Prisma 模块
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
