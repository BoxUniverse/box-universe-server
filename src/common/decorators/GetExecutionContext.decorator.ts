import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function GetExecutionContext(): ParameterDecorator {
  return createParamDecorator((data: any, context: ExecutionContext) => {
    return context;
  })();
}
