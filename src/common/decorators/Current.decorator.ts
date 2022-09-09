import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const Current = createParamDecorator((ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx);
  return context.getContext().req.user;
});
export default Current;
