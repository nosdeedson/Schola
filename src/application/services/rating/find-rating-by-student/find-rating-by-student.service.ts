import { Rating } from "@/domain/rating/rating";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";

export class FindRatingByStudent {

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface) {
        this.ratingRepository = ratingRepository;
    }

    async findRatingByStudent(studentId: string): Promise<Rating[]> {
        const result = await this.ratingRepository.findByStudentId(studentId);
        return result;
    }
}
