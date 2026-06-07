import { CommentEntity } from '@/infrastructure/entities/comment/comment.entity';
import { RepositoryInterface } from '../@shared/repository/repository.interface'
import { Comment } from './comment';

export interface CommentRepositoryInterface extends RepositoryInterface<CommentEntity, Comment> { }
