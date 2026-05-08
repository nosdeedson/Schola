import { StudentCommentRatingUsecaseDto } from "@/application/usecases/student-comment-rating/student-comment-rating-usecase-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length } from "class-validator";

export class StudentCommentRatingRequestDto {

    @ApiProperty({description: "A comment about a rating"})
    @IsNotEmpty()
    @Length(500)
    readonly comment: string;
    
    @ApiProperty({description: "Id of the person doing the comment"})
    @IsUUID()
    @IsNotEmpty()
    readonly idPersonHaveDone: string;
    
    @ApiProperty({description: "Id of the rating"})
    @IsUUID()
    @IsNotEmpty()
    readonly ratingId: string;

    constructor(
        comment: string,
        idPersonHaveDone: string,
        ratingId: string
    ) {
        this.comment = comment;
        this.idPersonHaveDone = idPersonHaveDone;
        this.ratingId = ratingId;
    }

    toStudentCommentRatingUsecaseDto(): StudentCommentRatingUsecaseDto{
        const dto = new StudentCommentRatingUsecaseDto(this.comment, this.idPersonHaveDone, this.ratingId);
        return dto;
    }
}