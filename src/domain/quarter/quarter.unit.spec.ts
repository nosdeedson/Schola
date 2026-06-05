import { mockQuarter } from "../../../tests/mocks/domain/quarter.mocks";
import { mockRating } from "../../../tests/mocks/domain/rating.mocks";

describe('Quarter unit test', () => {

    it('should create a valid Quarter', () => {
        const quarter = mockQuarter();
        expect(quarter.notification?.getErrors().length).toBe(0);
        expect(quarter.currentQuarter).toBeFalsy();
    });

    it('should have two error with begining and ending are undefined', () => {
        const quarter = mockQuarter({ beginningDate: undefined, endingDate: undefined });
        expect(quarter.notification?.getErrors().length).toBe(2);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "quarter date beginning must be informed" },
                { context: "quarter", message: "quarter date ending must be informed" },
            ]
        );
    });

    it('should have an error if begining is after endind', () => {
        const quarter = mockQuarter({ beginningDate: new Date(2026, 3, 30), endingDate: new Date(2026, 0, 1) });
        expect(quarter.notification?.getErrors().length).toBe(1);
        expect(quarter.notification?.getErrors()).toMatchObject(
            [
                { context: "quarter", message: "the begining of the quarter must before the end" },
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

    it('should set quarter as current', () => {
        const quarter = mockQuarter();
        quarter.currentQuarter = true;
        expect(quarter.currentQuarter).toBeTruthy();
        quarter.currentQuarter = false;
        expect(quarter.currentQuarter).toBeFalsy();
    });

    it('should set the beginning of quarter', () => {
        const quarter = mockQuarter();
        const beginning = new Date();
        quarter.beginningDate = beginning;
        expect(quarter.beginningDate.getTime()).toBe(beginning.getTime());
    });

    it('should set the ending of quarter', () => {
        const quarter = mockQuarter();
        const ending = new Date();
        quarter.endingDate = ending;
        expect(quarter.endingDate.getTime()).toBe(ending.getTime());
    });

    it('should set rating of quarter', () => {
        const quarter = mockQuarter();
        const rating = mockRating();
        quarter.rating = rating;
        expect(quarter.rating[0].getId()).toBe(rating.getId());
    });

    it('should get rating of quarter', () => {
        const quarter = mockQuarter();
        const rating = mockRating();
        quarter.rating = rating;
        expect(quarter.rating).toStrictEqual([rating]);
    });
});
