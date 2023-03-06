import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { decode } from 'next-auth/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const newContext = GqlExecutionContext.create(context);

    const secret = process.env.SECRET;

    const ctx = newContext.getContext();

    const { headers } = ctx?.req;

    const token = (headers?.authorization || headers?.Authorization)?.replace('Bearer ', '');

    try {
      const result = await decode({ token, secret });

      ctx.req.user = result;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
