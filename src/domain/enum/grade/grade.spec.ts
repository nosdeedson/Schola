import { Grade } from "./grade"
import { toEnum } from '../grade/grade'

describe('Grade unit test', () => {

    it.each([
        ['BAD', Grade.BAD],
        ['REGULAR', Grade.REGULAR],
        ['GOOD', Grade.GOOD],
        ['VERY_GOOD', Grade.VERY_GOOD],
        ['EXCELENT', Grade.EXCELENT],
    ])('should convert %s', (input, expected) => {
        expect(toEnum(input)).toBe(expected);
    });

    it('should return undefined', () => {
        const grade = 'invalid';
        expect(toEnum(grade)).toBeUndefined()
    })

})
