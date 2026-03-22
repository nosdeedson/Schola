import { RatingRepositoryInterface } from "src/domain/rating/rating.repository.interface";
import { CreateRatingDto } from "./create.rating.dto";
import { Rating } from "src/domain/rating/rating";
import { RatingEntity } from "src/infrastructure/entities/rating/rating.entity";
import { SystemError } from "src/application/services/@shared/system-error";

export class CreateRatingService{

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface){
        this.ratingRepository = ratingRepository;
    }

    async execute(dto: CreateRatingDto){

        try {
            const rating = new Rating(
                dto?.quarter, 
                dto.student,
                new Date(),
                dto.listing,
                dto.writing,
                dto.reading, dto.speaking,
                dto.grammar,
                dto.homework,
                dto.vocabulary
            );
            if(rating?.notification?.hasError()){
                throw new SystemError(rating?.notification?.getErrors());
            }
            const ratingEntity = RatingEntity.toRatingEntity(rating);
            await this.ratingRepository.create(ratingEntity);
        } catch (error) {
            throw error;
        }

    }

}