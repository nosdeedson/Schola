import { Comment } from "@/domain/comment/comment";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";


@Entity('comment')
export class CommentEntity extends GenericEntity {

    private constructor() { super() }

    @Column({
        nullable: false,
        name: 'comment',
        type: 'varchar',
        length: 500
    })
    comment: string;

    @Column({
        nullable: false,
        name: 'id_person_have_done',
        type: 'uuid',
    })
    idPersonHaveDone: string;

    @JoinColumn({
        name: 'rating_id'
    })
    @ManyToOne(() => RatingEntity, rating => rating.comments)
    @JoinColumn({
        name: 'rating_id',
        foreignKeyConstraintName: 'fk_comment_rating'
    })
    rating: RatingEntity;

    static toCommentEntity(comment: Comment, rating: RatingEntity): CommentEntity {
        let model = new CommentEntity();
        model.comment = comment.getComment();
        model.createdAt = comment.getCreatedAt();
        model.deletedAt = comment.getDeletedAt();
        model.updatedAt = comment.getUpdatedAt();
        model.id = comment.getId();
        model.idPersonHaveDone = comment.getIdPersonHadDone();
        model.rating = rating ? rating : null;
        return model;
    }

    static toCommentsEntity(comments: Comment[], rating: RatingEntity): CommentEntity[] {
        let models : CommentEntity[] = []
        comments.forEach(it => {
            models.push(this.toCommentEntity(it, rating));
        })
        return models;
    }
}