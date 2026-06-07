import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { ParentStudentMapper } from "./parent-student-mapper";


describe('ParentStudentMapper', () => {
    it('should convert a domain parentStudent to a entity ParentStudent', () => {
        const parent = mockParent();
        const student = mockStudent();
        expect(ParentStudentMapper.fromDomain(parent, student)).toBeInstanceOf(ParentStudentEntity);
    });
});
