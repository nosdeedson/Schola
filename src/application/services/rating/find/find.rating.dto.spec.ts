import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity"
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks"
import { FindRatingDto } from "./find.rating.dto";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";

describe('FindRatingDto', () => {
    it('should instantiate a FindRatingDto', () => {
        const rating = RatingEntity.toRatingEntity(mockRating());
        const dto = new FindRatingDto(rating);
        expect(dto).toBeDefined();
    });

    it('should instantiate a FindRatingDto', () => {
        const rating = RatingEntity.toRatingEntity(mockRating());
        const comment = CommentEntity.toCommentEntity(mockComment(), rating);
        rating.comments = [comment];
        const dto = new FindRatingDto(rating);
        expect(dto).toBeDefined();
        expect(dto.comments).toEqual([comment.comment])
    });
})
