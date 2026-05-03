import { ChildEntity, Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { PersonEntity } from "../@shared/person.entity";
import { ClassEntity } from "../class/class.entity";
import { ParentEntity } from "../parent/parent.entity";
import { Student } from "../../../domain/student/student";
import { Parent } from "../../../domain/parent/parent";
import { ParentStudentEntity } from "../parent-student/parent.student.entity";


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

    static toStudentEntity(student: Student): StudentEntity {
        let model = new StudentEntity();
        model.birthday = student.getBirthday();
        model.createdAt = student.getCreatedAt();
        model.deletedAt = student.getDeletedAt();
        model.updatedAt = student.getUpdatedAt();
        model.enrolled = student.getEnrolled();
        model.fullName = student.getName();
        model.id = student.getId();
        model.schoolGroup = ClassEntity.toClassEntity(student.getSchoolGroup());
        return model;
    }

    static toStudentsEntities(students: Student[]): StudentEntity[] {
        let models: StudentEntity[] = [];
        students.forEach(it => {
            let s = this.toStudentEntity(it);
            models.push(s);
        })
        return models;
    }

    get parents(): ParentEntity[] {
        return []
    }
}
