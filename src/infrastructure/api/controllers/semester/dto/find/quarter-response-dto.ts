import { QuarterDto } from "@/application/services/academic-semester/create/quarter/quarter.dto";

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
}
