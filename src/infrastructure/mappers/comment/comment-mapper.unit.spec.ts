import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { mockComment } from "../../../../tests/mocks/domain/comment.mocks";
import { CommentMapper } from "./comment-mapper";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { Comment } from "@/domain/comment/comment";
import { RatingMapper } from "../rating/rating-mapper";


describe('CommentMapper', () => {
    it('should convert domain comment to entity comment', () => {
        expect(CommentMapper.fromDomain(mockComment(), mockRating())).toBeInstanceOf(CommentEntity);
    });

    it('should convert comment entity to comment domain', () => {
        const commentEntity = CommentMapper.fromDomain(mockComment(), mockRating());
        expect(CommentMapper.fromEntity(commentEntity)).toBeInstanceOf(Comment);
    });

    it('should convert comment entity to comment domain without rating', () => {
        const commentEntity = CommentMapper.fromDomain(mockComment(), mockRating());
        commentEntity.rating = null;
        const entity = CommentMapper.fromEntity(commentEntity);
        expect(entity).toBeInstanceOf(Comment);
        expect(entity.getRating()).toBeUndefined();
    });
});
