import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString } from "class-validator";
import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";

export class QuarterRequestDto {

    @ApiProperty({ description: "Starting date of the quarter", example: "2026-02-02T00:16:52.483Z" })
    @IsDateString({ strict: true }, { message: 'The beginning of the semester is required' })
    beginningDate: string;

    @ApiProperty({ description: "Ending date of the quarter", example: "2026-04-15T23:16:52.483Z" })
    @IsDateString({ strict: true }, { message: 'The ending of the semester is required' })
    endingDate: string;

    @ApiProperty({ description: "Determine if it is the current quarter" })
    @IsBoolean({ message: 'currentQuarter is required' })
    currentQuarter: boolean;

    static toQuarterDto(dto: QuarterRequestDto): QuarterDto {
        return new QuarterDto({
            beginningDate: new Date(dto.beginningDate),
            endingDate: new Date(dto.endingDate),
            currentQuarter: dto.currentQuarter
        })
    }
}
