import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { POST_MODEL_PROVIDER } from '../providers';
import { PostModel } from '../models';
import { AdminSearch, UserSearch } from '../payloads';

@Injectable()
export class PostSearchService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(POST_MODEL_PROVIDER)
    private readonly postModel: Model<PostModel>
  ) {}

  // TODO - define post DTO
  public async adminSearch(req: AdminSearch): Promise<PageableData<PostModel>> {
    const query = {} as any;
    if (req.q) {
      query.$or = [
        {
          title: { $regex: req.q }
        }
      ];
    }
    if (req.status) {
      query.status = req.status;
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort
    } as any;
    const [data, total] = await Promise.all([
      this.postModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.postModel.countDocuments(query)
    ]);

    // if (data.length) {
    //   const authorIds = data.map((p) => p.authorId);
    //   if (authorIds.length) {
    //     const authors = await this.userService.findByIds(authorIds);
    //     // TODO - load users here
    //   }
    // }

    return {
      data, // TODO - define mdoel
      total
    };
  }

  public async userSearch(req: UserSearch): Promise<PageableData<PostModel>> {
    const query = {} as any;
    query.status = 'published';
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort
    } as any;
    const [data, total] = await Promise.all([
      this.postModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.postModel.countDocuments(query)
    ]);
    return {
      data, // TODO - define mdoel
      total
    };
  }
}
