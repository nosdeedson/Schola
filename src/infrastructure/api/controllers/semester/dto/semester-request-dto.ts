import { ApiProperty } from "@nestjs/swagger";
import { QuarterRequestDto } from "./quarter-request-dto";
import { Type } from "class-transformer";
import { CreateAcademicSemesterUsecaseDto } from "src/application/services/academic-semester/create/semester/academic-semester-usecase.dto";

export class SemesterRequestDto {

    @ApiProperty({description: "First quarter of the semester"})
    @Type(() => QuarterRequestDto)
    firstQuarter: QuarterRequestDto;

    @ApiProperty({description: "Second quarter of the semester"})
    @Type(() => QuarterRequestDto)
    secondQuarter: QuarterRequestDto;
    
    @ApiProperty({description: "Indicates if it is the current semester"})
    currentSemester: boolean;

    toSemester(): CreateAcademicSemesterUsecaseDto{
        return new CreateAcademicSemesterUsecaseDto({
            currentSemester : this.currentSemester,
            firstQuarter : this.firstQuarter.toQuarterDto(),
            secondQuarter : this.secondQuarter.toQuarterDto()
        });
    }
}