import { SaveRatingUsecaseDto } from "@/application/usecases/save-rating/save-rating-usecase-dto";
import { Grade } from "@/domain/enum/grade/grade";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class SaveRatingRequestDto {

    @ApiProperty({ description: 'Id of student' })
    @IsUUID("all", { message: "Student Id is required" })
    studentBeingEvaluatedId: string;

    @ApiProperty({ description: 'Id of teacher made the avaliaiton' })
    @IsUUID("all", { message: "Teacher Id is required" })
    teacherId: string;

    @ApiProperty({ description: 'Listining skills', example: "BAD" })
    @IsEnum(Grade, { message: "Listining skills is required" })
    listing: Grade;

    @ApiProperty({ description: 'Writing skills', example: "BAD" })
    @IsEnum(Grade, { message: "Writing skills is required" })
    writing: Grade;

    @ApiProperty({ description: 'Reading skills', example: "BAD" })
    @IsEnum(Grade, { message: "Reading skills is required" })
    reading: Grade;

    @ApiProperty({ description: 'Speaking skills', example: "BAD" })
    @IsEnum(Grade, { message: "Speaking skills is required" })
    speaking: Grade;

    @ApiProperty({ description: 'Grammar skills', example: "BAD" })
    @IsEnum(Grade, { message: "Grammar skills is required" })
    grammar: Grade;

    @ApiProperty({ description: 'Homework skills', example: "BAD" })
    @IsEnum(Grade, { message: "Homework skills is required" })
    homework: Grade;

    @ApiProperty({ description: 'Vocabulary skills', example: "BAD" })
    @IsEnum(Grade, { message: "Vocabulary skills is required" })
    vocabulary: Grade;

    @ApiProperty({ description: "Comment of the teacher" })
    @IsNotEmpty({ message: "A teacher's comment is requited" })
    @MaxLength(500, { message: "comment should be less than 500" })
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
