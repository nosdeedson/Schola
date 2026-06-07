import { RatingEntity } from '../../infrastructure/entities/rating/rating.entity'
import { RepositoryInterface } from '../@shared/repository/repository.interface'
import { Rating } from './rating';

export interface RatingRepositoryInterface extends RepositoryInterface<RatingEntity, Rating> {
    findByStudentId(studentId: string): Promise<Rating[]>;
}
