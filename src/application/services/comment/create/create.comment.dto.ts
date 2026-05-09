import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class CreateCommentDto {

    comment: string;
    namePersonHaveDone: string;
    rating: RatingEntity;

    constructor(
        comment: string,
        namePersonHaveDone: string,
        rating: RatingEntity
    ) {
        this.comment = comment;
        this.namePersonHaveDone = namePersonHaveDone;
        this.rating = rating;
    }

}
