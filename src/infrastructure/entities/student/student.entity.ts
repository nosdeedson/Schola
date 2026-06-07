import { ChildEntity, Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { PersonEntity } from "../@shared/person.entity";
import { ClassEntity } from "../class/class.entity";
import { ParentEntity } from "../parent/parent.entity";
import { Student } from "../../../domain/student/student";
import { Parent } from "../../../domain/parent/parent";
import { ParentStudentEntity } from "../parent-student/parent.student.entity";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";


@ChildEntity('student')
export class StudentEntity extends PersonEntity {

    constructor() { super() }

    @Column({
        nullable: false,
        name: 'enrolled',
        type: 'varchar',
        length: 10
    })
    enrolled: string;

    @OneToMany(() => ParentStudentEntity, ps => ps.student)
    parentStudents: ParentStudentEntity[];

    @ManyToOne(() => ClassEntity, schoolGroup => schoolGroup.students, { eager: false, onUpdate: 'CASCADE' })
    @JoinColumn({
        name: 'class_id',
        foreignKeyConstraintName: 'student_class_fk',
        referencedColumnName: 'id',
    })
    schoolGroup: ClassEntity;

    get parents(): ParentEntity[] {
        return []
    }
}
