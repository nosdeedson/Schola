import { ParentEntity } from "../parent/parent.entity";
import { StudentEntity } from "../student/student.entity";
import { ParentStudentEntity } from "../parent-student/parent.student.entity";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";

describe('ParentStudentEntity', () => {
  it('should be defined', () => {
    const student = mockStudent();
    const parent = mockParent(); 
    const studentEntity = StudentMapper.fromDomain(student);
    const parentEntity = ParentMapper.fromDomain(parent);
    const parentStudentEntity = ParentStudentMapper.fromDomain(parentEntity, studentEntity);
    expect(parentStudentEntity).toBeDefined();
    expect(parentStudentEntity.parent).toBe(parentEntity);
    expect(parentStudentEntity.student).toBe(studentEntity);
  });
} )