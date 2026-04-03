import { Class } from "../../../@/domain/class/class";
import { Parent } from "../../../@/domain/parent/parent";
import { Rating } from "../../../@/domain/rating/rating";
import { Student } from "../../../@/domain/student/student";
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