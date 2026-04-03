import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";

export class DeleteRatingService{

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface){
        this.ratingRepository = ratingRepository;
    }

    async execute(id: string){
        try {
            await this.ratingRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}