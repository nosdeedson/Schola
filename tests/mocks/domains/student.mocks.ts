import { Class } from "../../../src/domain/class/class";
import { Parent } from "../../../src/domain/parent/parent";
import { Rating } from "../../../src/domain/rating/rating";
import { Student } from "../../../src/domain/student/student";
import { mockClass } from "./class.mocks";
import { mockParent } from "./parent.mocks";
import { mockRating } from "./rating.mocks";


type StudentMock = {
    enroller?: string;
    nameParents?: string[];
    name?: string;
    birthday?: Date;
}


export function mockStudent(
    overrides: StudentMock = {}
): Student {
    return new Student({
        enrolled: overrides.enroller || '2020123456',
        nameParents: overrides.nameParents || undefined,
        name: overrides.name || 'John Doe',
        birthday: overrides.birthday || new Date(2000, 0, 1, 23, 59, 59)
    })
}