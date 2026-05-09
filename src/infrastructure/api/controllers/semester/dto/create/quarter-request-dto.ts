import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString } from "class-validator";
import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";

export class QuarterRequestDto {

    @ApiProperty({ description: "Starting date of the quarter", example: "2026-02-02T00:16:52.483Z" })
    @IsDateString()
    beginningDate: Date;

    @ApiProperty({ description: "Ending date of the quarter", example: "2026-04-15T23:16:52.483Z" })
    @IsDateString()
    endingDate: Date;

    @ApiProperty({ description: "Determine if it is the current quarter" })
    @IsBoolean()
    currentQuarter: boolean;

    toQuarterDto(): QuarterDto {
        return new QuarterDto({
            beginningDate: this.beginningDate,
            endingDate: this.endingDate,
            currentQuarter: this.currentQuarter
        })
    }
}
