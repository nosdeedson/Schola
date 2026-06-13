import { SystemError } from "@/application/services/@shared/system-error";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { UpdateRatingDto } from "./udpate.rating.dto";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";

export class UpdateRatingService {

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface) {
        this.ratingRepository = ratingRepository;
    }

    async execute(dto: UpdateRatingDto) {
        try {
            let entity = await this.ratingRepository.find(dto.id);
            if (!entity) {
                throw new SystemError([{ context: 'rating', message: 'Not found' }], 404);
            }
            entity = dto.updateEntity(entity);
            await this.ratingRepository.update(RatingMapper.fromDomain(entity));
        } catch (error) {
            throw error;
        }
    }
}
