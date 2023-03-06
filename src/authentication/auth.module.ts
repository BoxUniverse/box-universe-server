import { Module } from '@nestjs/common';
import { UsersModule } from '@src/users';
import { AuthGateway } from './auth.gateway';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver, AuthGateway],
  exports: [AuthService],
})
export class AuthModule {}
