import { Comment } from "@/domain/comment/comment";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";


export class CommentMapper {

    static fromEntity(entity: CommentEntity): Comment {
        if (!entity) return null;
        return new Comment(
            entity.comment,
            entity.namePersonHaveDone,
            entity.id,
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt
        );
    }

    static fromDomain(comment: Comment, rating: RatingEntity): CommentEntity {
        let model = new CommentEntity();
        model.comment = comment.getComment();
        model.createdAt = comment.getCreatedAt();
        model.deletedAt = comment.getDeletedAt();
        model.updatedAt = comment.getUpdatedAt();
        model.id = comment.getId();
        model.namePersonHaveDone = comment.getNamePersonHaveDone();
        model.rating = rating ? rating : null;
        return model;
    }

    static toCommentsEntity(comments: Comment[], rating: RatingEntity): CommentEntity[] {
        let models: CommentEntity[] = []
        comments.forEach(it => {
            models.push(this.fromDomain(it, rating));
        })
        return models;
    }

}
