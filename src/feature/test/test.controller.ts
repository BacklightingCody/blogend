import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TestService } from './test.service';
import { TestDto } from './dto/test.dto';
import { Test } from '@prisma/client';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Post('create')
  async createTest(@Body() testDto: TestDto): Promise<Test> {
    return this.testService.createTest(testDto);
  }

  @Get(':id')
  async getTestById(@Param('id') id: string): Promise<Test | null> {
    return this.testService.findTestById(Number(id));
  }

  @Get()
  async getAllTests(): Promise<Test[]> {
    return this.testService.findAllTests();
  }
}
