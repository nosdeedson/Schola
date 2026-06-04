import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { RatingCommentResponseDto, StudentRatingUsecaseResponseDto } from "./student-rating-usecase-response-dto";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { mockComment } from "../../../../tests/mocks/domain/comment.mocks";

describe('StudentRatingUsecaseResponseDto', () => {
    it('should instantiate a StudentRatingUsecaseResponseDto', () => {
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        expect(StudentRatingUsecaseResponseDto.toDto([ratingEntity])).toBeDefined()
    });

    it('should instantiate a RatingCommentResponseDto', () => {
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        const commentEntity = CommentEntity.toCommentEntity(mockComment(), ratingEntity);
        expect(RatingCommentResponseDto.from(commentEntity)).toBeDefined();
    });

    it('should instantiate a StudentRatingUsecaseResponseDto with comments', () => {
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        const commentEntity = CommentEntity.toCommentEntity(mockComment(), ratingEntity);
        ratingEntity.comments = [commentEntity];
        const result = StudentRatingUsecaseResponseDto.toDto([ratingEntity]) as StudentRatingUsecaseResponseDto[];
        expect(result).toBeDefined();
        expect(result[0].comments).toBeDefined();
    });

    it('should instantiate an empty array', () => {
        const ratingEntity = null as any;
        const result = StudentRatingUsecaseResponseDto.toDto(null);
        expect(result).toHaveLength(0);
    });
});
