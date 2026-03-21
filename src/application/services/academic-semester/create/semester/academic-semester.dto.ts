import { QuarterDto } from "../quarter/quarter.dto";

export class CreateAcademicSemesterDto {

    firstQuarter: QuarterDto;
    secondQuarter: QuarterDto;
    currentSemester: boolean;

    constructor(params: {
        firstQuarter: QuarterDto,
        secondQuarter: QuarterDto,
        currentSemester: boolean,
    }) {
        const { firstQuarter, secondQuarter, currentSemester } = params;
        this.firstQuarter = firstQuarter;
        this.secondQuarter = secondQuarter;
        this.currentSemester = currentSemester
    }

}