import { Rating } from "@/domain/rating/rating";
import { RatingMapper } from "./rating-mapper";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

describe('RatingMapper', () => {

    it('should convert from rating domain to entity', () => {
        expect(RatingMapper.fromDomain(mockRating())).toBeInstanceOf(RatingEntity);
    });

    it('should convert from rating entity to domain', () => {
        const entity = RatingMapper.fromDomain(mockRating());
        expect(RatingMapper.fromEntity(entity)).toBeInstanceOf(Rating);
    });
});
