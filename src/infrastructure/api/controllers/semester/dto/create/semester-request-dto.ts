import { ApiProperty } from "@nestjs/swagger";
import { QuarterRequestDto } from "./quarter-request-dto";
import { Type } from "class-transformer";
import { CreateAcademicSemesterUsecaseDto } from "@/application/services/academic-semester/create/semester/create-academic-semester-usecase.dto";
import { IsBoolean, IsDefined, IsNotEmpty, ValidateNested } from "class-validator";

export class SemesterRequestDto {

    @ApiProperty({ description: "First quarter of the semester" })
    @Type(() => QuarterRequestDto)
    @ValidateNested({ message: "Fisrtquater must be a QuarterRequestDto" })
    @IsDefined({ message: "Fistquarter is required" })
    firstQuarter: QuarterRequestDto;

    @ApiProperty({ description: "Second quarter of the semester" })
    @Type(() => QuarterRequestDto)
    @ValidateNested({ message: "Secondquater must be a QuarterRequestDto" })
    @IsDefined({ message: "Secondquarter is required" })
    secondQuarter: QuarterRequestDto;

    @ApiProperty({ description: "Indicates if it is the current semester" })
    @IsBoolean({ message: "currentSemester is required" })
    currentSemester: boolean;

    static toSemester(dto: SemesterRequestDto): CreateAcademicSemesterUsecaseDto {
        return new CreateAcademicSemesterUsecaseDto({
            currentSemester: dto.currentSemester,
            firstQuarter: QuarterRequestDto.toQuarterDto(dto.firstQuarter),
            secondQuarter: QuarterRequestDto.toQuarterDto(dto.secondQuarter)
        });
    }
}
