import { mockQuarter } from "../../../tests/mocks/domains/quarter.mocks"
import { AcademicSemester } from "./academic.semester"

describe('AcademicSemester unit tests', () =>{

    it('should instantiate a academicSemester without errors', () =>{
        const firstQuarter = mockQuarter({currentQuarter: false});
        const secondQuarter = mockQuarter({
            beginningDate: new Date(2026, 3, 1),
            endingDate: new Date(2026, 5, 30),
            currentQuarter: true
        });
        const semester = new AcademicSemester(firstQuarter, secondQuarter, true);
        expect(semester).toBeDefined();
        expect(semester.firstQuarter).toStrictEqual(firstQuarter);
        expect(semester.secondQuarter).toStrictEqual(secondQuarter);
        expect(semester.currentSemester).toBeTruthy();
        expect(semester.secondQuarter.currentQuarter).toBeTruthy();
        expect(semester.firstQuarter.currentQuarter).toBeFalsy;
    });

    it('academicSemester notification should have errors', () =>{
        const semester = new AcademicSemester(null as any, null as any, true);
        expect(semester.notification.getErrors().length > 0 ).toBeTruthy();
        expect(semester.notification.getErrors()).toMatchObject([
            { context: 'academicSemester', message: "First Quarter is required"},
            { context: 'academicSemester', message: "Second Quarter is required"},
        ]);
    });

    it('academicSemester notification should inform error day of ending Firstquarter is after beggining secondQuarter', () =>{
        const firstQuarter = mockQuarter({
            endingDate: new Date(2026, 4, 1)
        });
        const secondQuarter = mockQuarter({
            beginningDate: new Date(2026, 3, 1),
            endingDate: new Date(2026, 5, 30),
            currentQuarter: true
        });
        const semester = new AcademicSemester(firstQuarter, secondQuarter, true);
        expect(semester.notification.getErrors().length > 0 ).toBeTruthy();
        expect(semester.notification.getErrors()).toMatchObject([
            { context: 'academicSemester', message: "the end of the first Quarter must be before the start of the beggining of the secondQuarter"},
        ]);
    });

    it('academicSemester notification inform that the currentSemester atribute is required', () =>{
        const firstQuarter = mockQuarter({currentQuarter: false});
        const secondQuarter = mockQuarter({
            beginningDate: new Date(2026, 3, 1),
            endingDate: new Date(2026, 5, 30),
            currentQuarter: true
        });
        const semester = new AcademicSemester(firstQuarter, secondQuarter, null as any);
        expect(semester.notification.getErrors().length > 0 ).toBeTruthy();
        expect(semester.notification.getErrors()).toMatchObject([
            { context: 'academicSemester', message: "must inform academicSemester is the current or not"},
        ]);
    });
})