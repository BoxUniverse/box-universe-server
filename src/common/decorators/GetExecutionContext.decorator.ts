import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { GqlExecutionContext } from '@nestjs/graphql';

export function GetExecutionContext(headerName?: string): ParameterDecorator {
  return createParamDecorator((data: any, context: ExecutionContext) => {
    // const ctx = GqlExecutionContext.create(context);
    // const request = ctx.getContext().req as IncomingMessage;

    return context;
  })();
}
