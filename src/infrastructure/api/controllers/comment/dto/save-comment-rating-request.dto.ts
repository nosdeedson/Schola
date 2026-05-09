import { StudentCommentRatingUsecaseDto } from "@/application/usecases/comment-rating/comment-rating-usecase-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, MaxLength } from "class-validator";

export class SaveCommentRatingRequestDto {

    @ApiProperty({ description: "A comment about a rating", example: "test comment" })
    @IsNotEmpty()
    @MaxLength(500)
    readonly comment: string;

    @ApiProperty({ description: "Id of the person doing the comment" })
    @IsNotEmpty()
    readonly namePersonHaveDone: string;

    @ApiProperty({ description: "Id of the rating" })
    @IsUUID()
    @IsNotEmpty()
    readonly ratingId: string;

    constructor(
        comment: string,
        namePersonHaveDone: string,
        ratingId: string
    ) {
        this.comment = comment;
        this.namePersonHaveDone = namePersonHaveDone;
        this.ratingId = ratingId;
    }

    toStudentCommentRatingUsecaseDto(): StudentCommentRatingUsecaseDto {
        const dto = new StudentCommentRatingUsecaseDto(this.comment, this.namePersonHaveDone, this.ratingId);
        return dto;
    }
}
