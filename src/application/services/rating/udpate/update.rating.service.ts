import { SystemError } from "@/application/services/@shared/system-error";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { UpdateRatingDto } from "./udpate.rating.dto";

export class UpdateRatingService {

    private ratingRepository: RatingRepositoryInterface;

    constructor(ratingRepository: RatingRepositoryInterface) {
        this.ratingRepository = ratingRepository;
    }

    async execute(dto: UpdateRatingDto) {
        try {
            let entity = await this.ratingRepository.find(dto.id);
            if (!entity) {
                throw new SystemError([{ context: 'rating', message: 'Not found' }]);
            }
            entity = dto.updateEntity(entity);
            await this.ratingRepository.update(entity);
        } catch (error) {
            throw error;
        }
    }
}
