import { Entity } from "../@shared/entity";
import { Rating } from "../rating/rating";
import { CommentValidator } from "./comment.validator";

export class Comment extends Entity {
    private comment: string;
    private namePersonHaveDone: string;
    private rating: Rating;

    constructor(
        comment: string,
        namePersonHaveDone: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date
    ) {
        super(id, createdAt, updatedAt, deletedAt);
        this.comment = comment;
        this.namePersonHaveDone = namePersonHaveDone;
        this.validate();
    }

    validate() {
        new CommentValidator().validate(this);
    }

    getComment(): string {
        return this.comment;
    }

    setComment(comment: string) {
        this.comment = comment;
    }

    getNamePersonHaveDone(): string {
        return this.namePersonHaveDone
    }

    getRating(): Rating {
        return this.rating;
    }

    setRating(rating: Rating) {
        this.rating = rating;
    }
}
