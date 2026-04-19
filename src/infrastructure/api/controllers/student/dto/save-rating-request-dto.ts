import { SaveRatingUsecaseDto } from "@/application/usecases/save-rating/save-rating-usecase-dto";
import { Grade } from "@/domain/enum/grade/grade";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";

export class SaveRatingRequestDto {

    @ApiProperty({ description: 'Id of student' })
    @IsUUID()
    studentId: string;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    listing: Grade;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    writing: Grade;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    reading: Grade;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    speaking: Grade;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    grammar: Grade;

    @ApiProperty({ description: 'Id of student' })
    @IsEnum(Grade)
    homework: Grade;

    @IsEnum(Grade)
    @ApiProperty({ description: 'Id of student' })
    vocabulary: Grade;

    toUseCaseDto(): SaveRatingUsecaseDto {
        const dto = new SaveRatingUsecaseDto();
        dto.grammar = this.grammar;
        dto.homework = this.homework;
        dto.listing = this.listing;
        dto.reading = this.reading;
        dto.speaking = this.speaking;
        dto.studentId = this.studentId;
        dto.vocabulary = this.vocabulary;
        dto.writing = this.writing;
        return dto;
    }
}
