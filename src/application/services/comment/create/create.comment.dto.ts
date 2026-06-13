import { Rating } from "@/domain/rating/rating";

export class CreateCommentDto {

    comment: string;
    namePersonHaveDone: string;
    rating: Rating;

    constructor(
        comment: string,
        namePersonHaveDone: string,
        rating: Rating
    ) {
        this.comment = comment;
        this.namePersonHaveDone = namePersonHaveDone;
        this.rating = rating;
    }

}
