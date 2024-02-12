import { Types } from 'mongoose';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
export declare class FollowDto {
    _id: Types.ObjectId;
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    followerInfo?: UserDto;
    followingInfo?: PerformerDto;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<FollowDto>);
}
