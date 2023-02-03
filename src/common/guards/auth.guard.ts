import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { decode } from 'next-auth/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const ctx = GqlExecutionContext.create(context);

    const req = ctx.getContext().req;
    const { headers } = req;

    const token = headers?.authorization?.replace('Bearer ', '');
    const secret = process.env.SECRET;

    try {
      const result = await decode({ token, secret });
      req.user = result;

      return true;
    } catch (error) {
      // console.log(error);
      // console.log('error');

      throw new UnauthorizedException();
    }
  }
}
