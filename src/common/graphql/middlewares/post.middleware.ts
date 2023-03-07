import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const postMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
  const value = await next();
  if (typeof value === 'string')
    return {
      _id: value,
    };

  return value;
};
