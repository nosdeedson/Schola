import { Comment } from "@/domain/comment/comment";
import { Rating } from "@/domain/rating/rating";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { RatingMapper } from "../rating/rating-mapper";


export class CommentMapper {

    static fromEntity(entity: CommentEntity): Comment {
        if (!entity) return null;
        const comment = new Comment(
            entity.comment,
            entity.namePersonHaveDone,
            entity.id,
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt
        );
        if (entity.rating) comment.setRating(RatingMapper.fromEntity(entity.rating));
        return comment;
    }

    static fromDomain(comment: Comment, rating: Rating): CommentEntity {
        let model = new CommentEntity();
        model.comment = comment.getComment();
        model.createdAt = comment.getCreatedAt();
        model.deletedAt = comment.getDeletedAt();
        model.updatedAt = comment.getUpdatedAt();
        model.id = comment.getId();
        model.namePersonHaveDone = comment.getNamePersonHaveDone();
        model.rating = rating ? RatingMapper.fromDomain(rating) : null;
        return model;
    }

    static toCommentsEntity(comments: Comment[], rating: Rating): CommentEntity[] {
        let models: CommentEntity[] = []
        comments.forEach(it => {
            models.push(this.fromDomain(it, rating));
        })
        return models;
    }

}
