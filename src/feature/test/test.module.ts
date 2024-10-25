import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { PrismaService } from '@/prisma.service';
import { TestController } from './test.controller';

@Module({
  providers: [TestService, PrismaService],
  controllers: [TestController],
  exports: [PrismaService],
})
export class TestModule {}
