import { Quarter } from "@/domain/quarter/quarter";
import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";

export class QuarterDto {
    beginningDate: Date;
    endingDate: Date;
    currentQuarter: boolean;

    constructor(params: {
        beginningDate: Date,
        endingDate: Date,
        currentQuarter: boolean,
    }) {
        const { beginningDate, endingDate, currentQuarter } = params;
        this.beginningDate = beginningDate;
        this.endingDate = endingDate;
        this.currentQuarter = currentQuarter
    }

    toDomain(): Quarter {
        return new Quarter({ currentQuarter: this.currentQuarter, beginningDate: this.beginningDate, endingDate: this.endingDate })
    }

    static fromDomain(quarter: QuarterEntity): QuarterDto {
        return new QuarterDto({
            beginningDate: quarter.beginningDate,
            endingDate: quarter.endingDate,
            currentQuarter: quarter.currentQuarter,
        })
    }
}
