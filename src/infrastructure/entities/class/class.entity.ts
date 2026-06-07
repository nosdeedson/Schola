import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { StudentEntity } from "../student/student.entity";
import { WorkerEntity } from "../worker/worker.entity";
import { Class } from "@/domain/class/class";

@Entity('class')
export class ClassEntity extends GenericEntity {

    @Column({
        nullable: false,
        name: 'class_code'
    })
    classCode: string;

    @Column({
        nullable: false,
        name: 'class_name'
    })
    className: string;

    @Column({
        nullable: false,
        name: 'book_name'
    })
    bookName: string;

    @Column({
        nullable: false,
        name: 'first_day_of_class_in_week'
    })
    firstDayOfClassInWeek: string;

    @Column({
        nullable: false,
        name: 'second_day_of_class_in_week'
    })
    secondDayOfClassInWeek: string;

    @Column({
        nullable: false,
        name: 'time_first_day'
    })
    timeFirstDay: string;

    @Column({
        nullable: false,
        name: 'time_second_day'
    })
    timeSecondDay: string;

    @OneToMany(() => StudentEntity, student => student.schoolGroup, { eager: true })
    students: StudentEntity[];

    @ManyToOne(() => WorkerEntity, (teacher) => teacher.classes)
    @JoinColumn({
        foreignKeyConstraintName: 'fk_teacher_id',
        name: 'teacher_id'
    })
    teacher: WorkerEntity;

    setStudents(student: StudentEntity) {
        if (!this.students) {
            this.students = [];
        }
        this.students.push(student);
    }

    setTeacher(teacher: WorkerEntity) {
        this.teacher = teacher;
    }
}
