import { StudentCommentRatingUsecaseDto } from "@/application/usecases/comment-rating/comment-rating-usecase-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, MaxLength } from "class-validator";

export class SaveCommentRatingRequestDto {

    @ApiProperty({ description: "A comment about a rating", example: "test comment" })
    @IsNotEmpty({ message: "Comment is required" })
    @MaxLength(500, { message: "The comment must be less than 500" })
    readonly comment: string;

    @ApiProperty({ description: "Id of the person doing the comment" })
    @IsNotEmpty({ message: "The name of who did it is required" })
    readonly namePersonHaveDone: string;

    @ApiProperty({ description: "Id of the rating is required" })
    @IsUUID()
    @IsNotEmpty({ message: "Rating id must not be empty" })
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

    static toCommentRatingUsecaseDto(dto: SaveCommentRatingRequestDto): StudentCommentRatingUsecaseDto {
        const usecaseDto = new StudentCommentRatingUsecaseDto(
            dto.comment,
            dto.namePersonHaveDone,
            dto.ratingId);
        return usecaseDto;
    }
}
