import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function GetExecutionContext(headerName?: string): ParameterDecorator {
  return createParamDecorator((data: any, context: ExecutionContext) => {
    return context;
  })();
}
