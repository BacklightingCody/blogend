import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma.service';
import { UsersController } from './users.controller';
// import { AuthGuard } from '@/auth/auth.guard';
// import { AuthService } from '@/auth/auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { TokenService } from '@/utils/token.service';
import { AuthModule } from '@/auth/auth.module';
@Module({
  imports: [AuthModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
