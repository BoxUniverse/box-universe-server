import {
    ArgumentsHost,
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

export const Authorization = createParamDecorator(
  async (context: ExecutionContext, host: ArgumentsHost): Promise<any> => {
    const {context: ctx} = GqlArgumentsHost.create(host).getContext();
  
    if (ctx?.user) {
      return ctx.user
    }else if(ctx?.req?.user) {
      return ctx.req.user
    }
    throw new UnauthorizedException();
  },
);
