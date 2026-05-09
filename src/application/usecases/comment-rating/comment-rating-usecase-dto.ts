export class StudentCommentRatingUsecaseDto {
    comment: string;
    namePersonHaveDone: string;
    ratingId: string;

    constructor(
        comment: string,
        namePersonHaveDone: string,
        ratingId: string
    ) {
        this.comment = comment;
        this.namePersonHaveDone = namePersonHaveDone;
        this.ratingId = ratingId;
    }
}
