import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestDocument } from '@src/requests';
import { Model } from 'mongoose';
import { Request } from "./requests.schema";

@Injectable()
export class RequestsRepository {
  constructor(@InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>) {}

  async addRequest(request: Request): Promise<Request> {
    return this.requestModel.create({
      ...request,
    });
  }

  async getRequests(info: Partial<Request>): Promise<Request[]> {
    return this.requestModel.aggregate<Request>([
      {
        $match: {
          ...info,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'userRequest',
          foreignField: 'id',
          as: 'userRequest',
        },
      },
      {
        $unwind: {
          path: '$userRequest',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'userReceive',
          foreignField: 'id',
          as: 'userReceive',
        },
      },
      {
        $unwind: {
          path: '$userReceive',
        },
      },
    ]);

    // return this.requestModel.find({ ...info });
  }

  async acceptRequest(request: Partial<Request>): Promise<Request> {
    const match = {
      ...request,
      isPending: true,
      isAccept: false,
      isReject: false,
    };
    const resultUpdate = await this.requestModel.updateOne(match, {
      isPending: false,
      isAccept: true,
    });

    if (resultUpdate.modifiedCount) {
      const resultAggregate = await this.requestModel.aggregate<Request>([
        {
          $match: {
            ...match,
            isPending: false,
            isAccept: true,
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userRequest',
            foreignField: 'id',
            as: 'userRequest',
          },
        },
        {
          $unwind: {
            path: '$userRequest',
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userReceive',
            foreignField: 'id',
            as: 'userReceive',
          },
        },
        {
          $unwind: {
            path: '$userReceive',
          },
        },
      ]);

      await this.requestModel.deleteOne({
        userReceive: match.userReceive,
        userRequest: match.userRequest,
      });

      return resultAggregate[0];
    }
    return null;
  }

  async rejectRequest(request: Partial<Request>): Promise<Request> {
    const match = {
      ...request,
      isPending: true,
      isAccept: false,
      isReject: false,
    };
    const resultUpdate = await this.requestModel.updateOne(match, {
      isReject: true,
      isPending: false,
    });
    if (resultUpdate.modifiedCount) {
      const resultAggregate = await this.requestModel.aggregate([
        {
          $match: {
            ...match,
            isReject: true,
            isPending: false,
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userRequest',
            foreignField: 'id',
            as: 'userRequest',
          },
        },
        {
          $unwind: {
            path: '$userRequest',
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userReceive',
            foreignField: 'id',
            as: 'userReceive',
          },
        },
        {
          $unwind: {
            path: '$userReceive',
          },
        },
      ]);

      await this.requestModel.deleteOne({
        userReceive: match.userReceive,
        userRequest: match.userRequest,
      });

      return resultAggregate[0];
    }
    return null;
  }
}
