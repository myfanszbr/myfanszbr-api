import {
  IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedCreatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    fromSourceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    text: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
    fileIds: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
    thumbnailId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    teaserId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    pollDescription: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
    pollIds: string[];

  @ApiProperty()
  @IsDateString()
  @IsOptional()
    pollExpiredAt: Date;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    isSale: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
    price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
    streamingScheduled: Date;
}
