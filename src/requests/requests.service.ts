import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ProfilesService } from '@profiles/profiles.service';
import { Queue } from 'bull';
import { RequestsRepository } from './requests.repository';
import { Request } from './requests.schema';

@Injectable()
export class RequestsService {
  constructor(
    private readonly requestsRepository: RequestsRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async addRequest(request: Request): Promise<Request> {
    return this.requestsRepository.addRequest(request);
  }

  async getRequests(info: Partial<Request>): Promise<Request[]> {
    return this.requestsRepository.getRequests(info);
  }

  async acceptRequest(request) {
    const userId = request.userRequest;

    const friendId = request.userReceive;

    const result = this.requestsRepository.acceptRequest(request);

    if (result) this.profilesService.queueAddFriend(userId, friendId);
    return result;
  }

  async rejectRequest(request: Partial<Request>) {
    return this.requestsRepository.rejectRequest(request);
  }
}
