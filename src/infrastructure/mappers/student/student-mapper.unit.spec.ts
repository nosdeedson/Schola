import { Student } from "@/domain/student/student";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { StudentMapper } from "./student-mapper";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

describe('StudentMapper', () => {
    it('should convert to domain student', () => {
        const entity = StudentMapper.fromDomain(mockStudent());
        expect(StudentMapper.fromEntity(entity)).toBeInstanceOf(Student);
    });

    it('should convert domain student to entity student', () => {
        expect(StudentMapper.fromDomain(mockStudent())).toBeInstanceOf(StudentEntity);
    });
});
