import { Parent } from "../../../domain/parent/parent";
import { Student } from "../../../domain/student/student";
import { ChildEntity, JoinColumn, ManyToMany, OneToMany } from "typeorm";
import { PersonEntity } from "../@shared/person.entity";
import { StudentEntity } from "../student/student.entity";
import { ParentStudentEntity } from "../parent-student/parent.student.entity";


@ChildEntity('parent')
export class ParentEntity extends PersonEntity {

    constructor() { super() }

    @OneToMany(() => ParentStudentEntity, ps => ps.parent)
    parentStudents: ParentStudentEntity[];

}
