import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
