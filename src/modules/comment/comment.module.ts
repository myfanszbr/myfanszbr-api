import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { ReactionModule } from 'src/modules/reaction/reaction.module';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { commentProviders } from './providers/comment.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { PerformerAssetsModule } from '../performer-assets/performer-assets.module';
import { ReplyCommentListener, ReactionCommentListener, DeleteUserListener } from './listeners';
import { FeedModule } from '../feed/feed.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    MongoDBModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => PerformerAssetsModule),
    forwardRef(() => ReactionModule),
    forwardRef(() => FeedModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...commentProviders,
    CommentService,
    ReplyCommentListener,
    ReactionCommentListener,
    DeleteUserListener
  ],
  controllers: [
    CommentController
  ],
  exports: [CommentService]
})
export class CommentModule {}
