import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { ParentStudentMapper } from "@/infrastructure/mappers/parent-student/parent-student-mapper";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";

describe('ParentStudentEntity', () => {
  it('should be defined', () => {
    const student = mockStudent();
    const parent = mockParent(); 
    const parentStudentEntity = ParentStudentMapper.fromDomain(parent, student);
    expect(parentStudentEntity).toBeDefined();
    expect(parentStudentEntity.parent).toStrictEqual(ParentMapper.fromDomain(parent));
    expect(parentStudentEntity.student).toStrictEqual(StudentMapper.fromDomain(student));
  });
} )