import { QuarterDto } from "../quarter/quarter.dto";

export class CreateAcademicSemesterDto {

    firsQuarter: QuarterDto;
    secondQuarter: QuarterDto;
    currentSemester: boolean;

    constructor(params: {
        firsQuarter: QuarterDto,
        secondQuarter: QuarterDto,
        currentSemester: boolean,
    }) {
        const { firsQuarter, secondQuarter, currentSemester } = params;
        this.firsQuarter = firsQuarter;
        this.secondQuarter = secondQuarter;
        this.currentSemester = currentSemester
    }

}