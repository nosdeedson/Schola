import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { providers } from './providers/comments-providers';

@Module({
    controllers: [CommentController],
    imports: [],
    providers: [...providers]
})
export class CommentModule { }
