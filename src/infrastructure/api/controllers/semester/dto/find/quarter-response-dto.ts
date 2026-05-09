import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";
import { Quarter } from "@/domain/quarter/quarter";
import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";
import { endOfWeekWithOptions } from "date-fns/fp";

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

    static fromQuarterEntity(quarter: QuarterEntity) {
        const out = new QuarterResponseDto();
        out.beginningDate = quarter.beginningDate;
        out.endingDate = quarter.endingDate;
        out.currentQuarter = quarter.currentQuarter;
        return out;
    }
}
