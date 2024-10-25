import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { TokenService } from '@/utils/token.service';
import { PassportModule } from '@nestjs/passport'; // 新增
// import { GitHubGuard } from './github.guard';
import { GithubStrategy } from './github.strategy'; // 新增
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/feature/users/users.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || jwtConstants.secret,
      signOptions: { expiresIn: '10s' },
    }),
  ],
  providers: [AuthService, TokenService, GithubStrategy, PrismaService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
