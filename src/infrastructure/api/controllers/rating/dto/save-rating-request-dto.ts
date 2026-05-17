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

    static toUseCaseDto(dto: SaveRatingRequestDto): SaveRatingUsecaseDto {
        const usecaseDto = new SaveRatingUsecaseDto();
        usecaseDto.grammar = dto.grammar;
        usecaseDto.homework = dto.homework;
        usecaseDto.listing = dto.listing;
        usecaseDto.reading = dto.reading;
        usecaseDto.speaking = dto.speaking;
        usecaseDto.vocabulary = dto.vocabulary;
        usecaseDto.writing = dto.writing;
        usecaseDto.comment = dto.comment;
        usecaseDto.studentBeingEvaluatedId = dto.studentBeingEvaluatedId;
        usecaseDto.teacherId = dto.teacherId;
        return usecaseDto;
    }
}
