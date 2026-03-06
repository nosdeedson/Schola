import { mockQuarter } from "../../../tests/mocks/domains/quarter.mocks";

describe('Quarter unit test', () => {

    it('should create a valid Quarter', () => {
        const quarter = mockQuarter();
        expect(quarter.notification?.getErrors().length).toBe(0);
        expect(quarter.currentQuarter).toBeFalsy();
    });

    it('should have two error with beggining and ending are undefined', () => {
        const quarter = mockQuarter({ beginningDate: undefined, endingDate: undefined });
        expect(quarter.notification?.getErrors().length).toBe(2);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "quarter date beginning must be informed" },
                { context: "quarter", message: "quarter date ending must be informed" },
            ]
        );
    });

    it('should have an error if beggining is after endind', () => {
        const quarter = mockQuarter({ beginningDate: new Date(2026, 3, 30), endingDate: new Date(2026, 0, 1) });
        expect(quarter.notification?.getErrors().length).toBe(1);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "the beggining of the quarter must before the end" },
            ]
        );
    });

    it('should have an error if the quarter starts on weekend', () => {
        const quarter = mockQuarter({ beginningDate: new Date(2026, 1, 1), endingDate: new Date(2026, 3, 30) });
        expect(quarter.notification?.getErrors().length).toBe(1);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "the quarter must start and end in a weekday" },
            ]
        );
    });

    it('should have an error if the quarter ends on weekend', () => {
        const quarter = mockQuarter({ beginningDate: new Date(2026, 1, 1), endingDate: new Date(2026, 3, 26) });
        expect(quarter.notification?.getErrors().length).toBe(1);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "the quarter must start and end in a weekday" },
            ]
        );
    });
})