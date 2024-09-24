import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/feature/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { TokenService } from '@/utils/token.service';
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10s' },
    }),
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
