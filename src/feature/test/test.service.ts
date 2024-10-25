import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Test } from '@prisma/client';
import { TestDto } from './dto/test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  // 创建新记录
  async createTest(testDto: TestDto): Promise<Test> {
    return this.prisma.test.create({
      data: {
        name: testDto.name,
        phone: testDto.phone,
      },
    });
  }

  // 根据 ID 查找记录
  async findTestById(id: number): Promise<Test | null> {
    return this.prisma.test.findUnique({
      where: { id },
    });
  }

  // 查找所有记录
  async findAllTests(): Promise<Test[]> {
    return this.prisma.test.findMany();
  }
}
