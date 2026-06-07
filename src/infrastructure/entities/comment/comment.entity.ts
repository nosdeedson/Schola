import { Comment } from "@/domain/comment/comment";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";


@Entity('comment')
export class CommentEntity extends GenericEntity {

    @Column({
        nullable: false,
        name: 'comment',
        type: 'varchar',
        length: 500
    })
    comment: string;

    @Column({
        nullable: false,
        name: 'name_person_have_done',
        type: 'varchar',
        length: 100
    })
    namePersonHaveDone: string;

    @ManyToOne(() => RatingEntity, rating => rating.comments, { nullable: false })
    @JoinColumn({
        name: 'rating_id',
        foreignKeyConstraintName: 'fk_comment_rating',
    })
    rating: RatingEntity;

}
