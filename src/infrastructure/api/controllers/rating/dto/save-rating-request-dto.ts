import { SaveRatingUsecaseDto } from "@/application/usecases/save-rating/save-rating-usecase-dto";
import { Grade } from "@/domain/enum/grade/grade";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class SaveRatingRequestDto {

    @ApiProperty({ description: 'Id of student' })
    @IsUUID()
    studentBeingEvaluatedId: string;

    @ApiProperty({ description: 'Id of teacher made the avaliaiton' })
    @IsUUID()
    teacherId: string;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    listing: Grade;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    writing: Grade;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    reading: Grade;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    speaking: Grade;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    grammar: Grade;

    @ApiProperty({ description: 'Id of student', example: "BAD" })
    @IsEnum(Grade)
    homework: Grade;

    @IsEnum(Grade)
    @ApiProperty({ description: 'Id of student', example: "BAD" })
    vocabulary: Grade;

    @ApiProperty({ description: "Comment of the teacher" })
    @IsNotEmpty()
    @MaxLength(500)
    comment: string;

    toUseCaseDto(): SaveRatingUsecaseDto {
        const dto = new SaveRatingUsecaseDto();
        dto.grammar = this.grammar;
        dto.homework = this.homework;
        dto.listing = this.listing;
        dto.reading = this.reading;
        dto.speaking = this.speaking;
        dto.vocabulary = this.vocabulary;
        dto.writing = this.writing;
        dto.comment = this.comment;
        dto.studentBeingEvaluatedId = this.studentBeingEvaluatedId;
        dto.teacherId = this.teacherId;
        return dto;
    }
}
