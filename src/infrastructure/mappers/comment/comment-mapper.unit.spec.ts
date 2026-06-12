import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { mockComment } from "../../../../tests/mocks/domain/comment.mocks";
import { CommentMapper } from "./comment-mapper";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { Comment } from "@/domain/comment/comment";


describe('CommentMapper', () => {
    it('should convert domain comment to entity comment', () => {
        const ratingEntity = RatingMapper.fromDomain(mockRating());
        expect(CommentMapper.fromDomain(mockComment(), ratingEntity)).toBeInstanceOf(CommentEntity);
    });

    it('should convert comment entity to comment domain', () => {
        const ratingEntity = RatingMapper.fromDomain(mockRating());
        const commentEntity = CommentMapper.fromDomain(mockComment(), ratingEntity);
        expect(CommentMapper.fromEntity(commentEntity)).toBeInstanceOf(Comment);
    });
});
