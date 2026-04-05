import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class FindRatingByStudent {

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface) {
        this.ratingRepository = ratingRepository;
    }

    async findRatingByStudent(studentId: string): Promise<RatingEntity> {
        return await this.ratingRepository.findByStudentId(studentId);
    }
}
