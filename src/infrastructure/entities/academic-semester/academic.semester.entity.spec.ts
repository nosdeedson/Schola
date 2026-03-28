import { AcademicSemesterEntity } from "./academic.semester.entity";
import { mockSemester } from '../../../../tests/mocks/domain/semester.mocks'
import { mockQuarter } from '../../../../tests/mocks/domain/quarter.mocks'

describe("AcademicSemester unit test", () => {

    it('should instantiate an AcademicSemesterEntity from AcademicSemester', () => {
         const firstQuarter = mockQuarter({currentQuarter: true});
        const secondQuarter = mockQuarter({
            beginningDate: new Date(2026, 5, 30, 23, 59),
            endingDate: new Date(2026, 7, 30 , 23, 59 ),
            currentQuarter: false
        });

        const semester = mockSemester({currentSemester: true, secondQuarter, firstQuarter});
        const entity = AcademicSemesterEntity.toEntity(semester);
        expect(entity).toBeDefined();
        expect(entity.current).toBeTruthy();
        expect(entity.quarters[0].beginningDate.getTime()).toEqual(semester.firstQuarter.beginningDate.getTime());
        expect(entity.quarters[0].endingDate.getTime()).toEqual(semester.firstQuarter.endingDate.getTime());
        expect(entity.quarters[0].currentQuarter).toBeTruthy();
        expect(entity.quarters[1].beginningDate.getTime()).toEqual(semester.secondQuarter.beginningDate.getTime());
        expect(entity.quarters[1].endingDate.getTime()).toEqual(semester.secondQuarter.endingDate.getTime());
        expect(entity.quarters[1].currentQuarter).toBeFalsy();
    })
})