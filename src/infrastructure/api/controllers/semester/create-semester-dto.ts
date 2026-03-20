import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { CreateAcademicSemesterDto } from "src/application/services/academic-semester/create/academic-semester.dto";

export class CreateSemesterDto{

    @ApiProperty({description: 'Date of the beginning academic semester', example: '2025-01-01T12:00:00Z'})
    @Type(() => Date)
    @IsDate({message: 'date must be a valid ISO 8601 date string'})
    beginning: Date;

    @Type(() => Date)
    @IsDate({message: 'date must be a valid ISO 8601 date string'})
    @ApiProperty({description: 'Date of the ending of the academic semester'})
    ending: Date;

    toInput(): CreateAcademicSemesterDto{
        return new CreateAcademicSemesterDto(this.beginning, this.ending);
    }
}