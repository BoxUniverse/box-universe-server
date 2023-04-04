import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { decode } from 'next-auth/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const newContext = GqlExecutionContext.create(context);

    const secret = process.env.SECRET;

    const { context: ctx } = newContext.getContext();
    let headers = null;
    // INFO: WebSocketContext
    if (ctx?.connectionParams) {
      headers = ctx.connectionParams;
    } else {
      // Http Context
      if (ctx.req) {
        const sym = Object.getOwnPropertySymbols(ctx?.req).find(
          (s) => s.description === 'kHeaders',
        );

        headers = sym ? ctx.req[sym] : null;
      }
    }
    const token = headers?.authorization?.replace('Bearer ', '');

    try {
      const result = await decode({ token, secret });
      if (ctx.req) {
        ctx.req.user = result;
      } else {
        ctx.user = result;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Guard Unauthorized');
    }
  }
}
