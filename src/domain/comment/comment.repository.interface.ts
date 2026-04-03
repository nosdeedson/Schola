import { CommentEntity } from '@/infrastructure/entities/comment/comment.entity';
import { RepositoryInterface } from '../@shared/repository/repository.interface'

export interface CommentRepositoryInterface extends RepositoryInterface<CommentEntity>{}