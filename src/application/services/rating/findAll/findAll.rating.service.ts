import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { FindAllRatingDto } from "./findAll.rating.dto";

export class FindAllRatingService {

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface){
        this.ratingRepository = ratingRepository;
    }

    async execute(): Promise<FindAllRatingDto>{
        let entities = await this.ratingRepository.findAll();
        let results = new FindAllRatingDto(entities);
        return results;
    }

}