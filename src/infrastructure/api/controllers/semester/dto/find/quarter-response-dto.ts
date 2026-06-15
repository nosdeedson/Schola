import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";
import { Quarter } from "@/domain/quarter/quarter";

export class QuarterResponseDto {
    beginningDate: Date;
    endingDate: Date;
    currentQuarter: boolean;

    static fromQuarterDto(dto: QuarterDto): QuarterResponseDto {
        const out = new QuarterResponseDto();
        out.beginningDate = dto.beginningDate;
        out.endingDate = dto.endingDate;
        out.currentQuarter = dto.currentQuarter;
        return out;
    }

    static fromQuarterEntity(quarter: Quarter) {
        const out = new QuarterResponseDto();
        out.beginningDate = quarter.beginningDate;
        out.endingDate = quarter.endingDate;
        out.currentQuarter = quarter.currentQuarter;
        return out;
    }
}
