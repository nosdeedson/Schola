import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString } from "class-validator";
import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";

export class QuarterRequestDto {

    @ApiProperty({ description: "Starting date of the quarter" })
    @IsDateString()
    beginningDate: Date;

    @ApiProperty({ description: "Ending date of the quarter" })
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
