import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { commentsProviders } from './providers/comments-providers';

@Module({
    controllers: [CommentController],
    imports: [],
    providers: [...commentsProviders]
})
export class CommentModule { }
