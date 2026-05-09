export class StudentCommentRatingUsecaseDto {
    comment: string;
    idPersonHaveDone: string;
    ratingId: string;

    constructor(
        comment: string,
        idPersonHaveDone: string,
        ratingId: string
    ) {
        this.comment = comment;
        this.idPersonHaveDone = idPersonHaveDone;
        this.ratingId = ratingId;
    }
}