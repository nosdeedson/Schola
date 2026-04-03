import { Parent } from "../../../@/domain/parent/parent";
import { Student } from "../../../@/domain/student/student"
import { mockStudent } from "./student.mocks";

type ParentMock = {
    nameStudents?: string[];
    name?: string,
    birthday?: Date,
}

export function mockParent(
    overrides: ParentMock = {}
) : Parent{
    return new Parent({
        nameStudents: overrides.nameStudents || undefined,
        name: overrides.name || 'any_name',
        birthday: overrides.birthday || new Date(2000, 0, 1, 23, 12, 12),
    })
}/*  */