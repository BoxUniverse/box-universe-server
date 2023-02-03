import { Authorization } from '@decorators/Authorization.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Current } from '@users/types/UserOAuth';
import RequestInput from './dto/requests.input';
import { Request } from './requests.schema';
import { RequestsService } from './requests.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver()
@UseGuards(AuthGuard)
export class RequestsResolver {
  constructor(private readonly requestsService: RequestsService) {}

  // INFO: QUERY
  @Query(() => [Request], {
    nullable: false,
    name: 'getRequests',
  })
  async retrieveRequests(
    @Args({ name: 'request', type: () => RequestInput.RetrieveRequest })
    info: RequestInput.RetrieveRequest,
    @Authorization()
    user: Current,
  ): Promise<Request[]> {
    if (!info?.userReceive) info.userReceive = user._id.toString();
    console.log(user);

    return this.requestsService.getRequests(info);
  }

  // INFO: MUTATION
  @Mutation(() => Request, {
    nullable: false,
    name: 'addRequest',
  })
  async addRequest(
    @Args({ name: 'request', type: () => RequestInput.CreateRequest })
    request: RequestInput.CreateRequest,
    @Authorization()
    user: Current,
  ): Promise<Request> {
    const userRequest = request.userRequest || user._id.toString();

    const newRequest = this.requestsService.addRequest({
      userReceive: request.userReceive,
      userRequest,
    });

    pubSub.publish('requestAdded', { requestAdded: newRequest });
    return newRequest;
  }

  @Mutation(() => Request, {
    nullable: true,
    name: 'acceptRequest',
  })
  async acceptRequest(
    @Args({ name: 'request', type: () => RequestInput.InfoRequest })
    request: RequestInput.InfoRequest,
    @Authorization()
    user: Current,
  ): Promise<Request> {
    const userReceive = request.userReceive || user._id.toString();
    return this.requestsService.acceptRequest({
      userReceive,
      userRequest: request.userRequest,
    });
  }

  @Mutation(() => Request, {
    nullable: true,
    name: 'rejectRequest',
  })
  async rejectRequest(
    @Args({ name: 'request', type: () => RequestInput.InfoRequest })
    request: RequestInput.InfoRequest,
    @Authorization()
    user: Current,
  ): Promise<Request> {
    const userReceive = request.userReceive || user._id.toString();
    return this.requestsService.rejectRequest({
      userReceive,
      userRequest: request.userRequest,
    });
  }

  // NOTE: SUBSCRIPTION
  @Subscription(() => [Request], {
    name: 'requestAdded',
  })
  async subscribeRequestAdded() {
    return pubSub.asyncIterator('requestAdded');
  }
}
