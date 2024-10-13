import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '#/prisma.service';
import { UsersController } from './users.controller';
// import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
// import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@/utils/token.service';
@Module({
  // imports: [AuthGuard],
  providers: [UsersService, AuthService, TokenService, PrismaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
