import { QuarterRequestDto } from "./quarter-request-dto";
import { SemesterRequestDto } from "./semester-request-dto";

describe('SemesterRequestDto', () => {

    it('should instantiate SemesterRequestDto', () => {
        const firstQuarter = new QuarterRequestDto();
        firstQuarter.beginningDate = "2026-02-02T00:16:52.483Z"
        firstQuarter.currentQuarter = true;
        firstQuarter.endingDate = "2026-04-15T23:16:52.483Z";

        const semesterDto = new SemesterRequestDto();
        semesterDto.currentSemester = true;
        semesterDto.firstQuarter = firstQuarter;

        const secondQuarter = new QuarterRequestDto();
        secondQuarter.beginningDate = "2026-04-16T00:16:52.483Z"
        secondQuarter.currentQuarter = true;
        secondQuarter.endingDate = "2026-06-30T23:16:52.483Z";

        semesterDto.secondQuarter = secondQuarter;
        expect(semesterDto).toBeDefined();
        expect(semesterDto.firstQuarter).toStrictEqual(firstQuarter);
        expect(semesterDto.secondQuarter).toStrictEqual(secondQuarter);
        expect(semesterDto.currentSemester).toBeTruthy();
    });
});