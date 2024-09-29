import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/feature/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { TokenService } from '@/utils/token.service';
import { PassportModule } from '@nestjs/passport'; // 新增
import { GitHubGuard } from './github.guard';
import { GithubStrategy } from './github.strategy'; // 新增

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10s' },
    }),
  ],
  providers: [AuthService, TokenService, GithubStrategy, GitHubGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
