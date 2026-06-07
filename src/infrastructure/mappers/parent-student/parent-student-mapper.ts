import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";
import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { ParentMapper } from "../parent/parent-mapper";
import { StudentMapper } from "../student/student-mapper";
import { v4 as uuidv4 } from 'uuid';

export class ParentStudentMapper {

    static fromDomain(parent: Parent, student: Student): ParentStudentEntity {
        const ps = new ParentStudentEntity();
        ps.id = uuidv4().toString() as string;
        ps.parent = ParentMapper.fromDomain(parent);
        ps.student = StudentMapper.fromDomain(student);
        return ps;
    }
}
