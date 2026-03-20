import { dot } from "node:test/reporters";
import { Quarter } from "src/domain/quarter/quarter";

export class QuarterDto{
    beginningDate: Date;
    endingDate: Date;
    currentQuarter: boolean;

    constructor(params:{
        beginningDate: Date,
        endingDate: Date,
        currentQuarter: boolean,
    }) {
        const {beginningDate, endingDate, currentQuarter} = params;
        this.beginningDate = beginningDate;
        this.endingDate = endingDate;
        this.currentQuarter = currentQuarter
    }

    toDomain(): Quarter{
        return new Quarter({currentQuarter: this.currentQuarter, beginningDate: this.beginningDate, endingDate: this.endingDate})
    }
}