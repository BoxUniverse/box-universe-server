import { GraphQLException } from '@exceptions/graphql.exception';
import { Catch, ExceptionFilter } from '@nestjs/common';

@Catch(GraphQLException)
export class GraphQLExceptionFilter extends GraphQLException implements ExceptionFilter {
  catch(exception: GraphQLException) {
    return new GraphQLException(exception.getResponse().toString(), exception.getStatus());
  }
}
