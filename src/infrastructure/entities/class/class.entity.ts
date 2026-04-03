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

    @OneToMany(() => StudentEntity, student => student.schoolGroup)
    students: StudentEntity[];

    @ManyToOne(() => WorkerEntity, (teacher) => teacher.classes)
    @JoinColumn({
        foreignKeyConstraintName: 'fk_teacher_id',
        name: 'teacher_id'
    })
    teacher: WorkerEntity;

    static toClassEntity(schoolGroup: Class): ClassEntity {
        if (!schoolGroup) {
            return null;
        }
        let model = new ClassEntity();
        model.bookName = schoolGroup.getNameBook();
        model.classCode = schoolGroup.getClassCode();
        model.className = schoolGroup.getName();
        model.createdAt = schoolGroup.getCreatedAt();
        model.deletedAt = schoolGroup.getDeletedAt();
        model.firstDayOfClassInWeek = schoolGroup.getSchecule().getDayOfWeek()[0];
        model.id = schoolGroup.getId();
        model.secondDayOfClassInWeek = schoolGroup.getSchecule().getDayOfWeek()[1];
        model.timeFirstDay = schoolGroup.getSchecule().getTimes().get(model.firstDayOfClassInWeek);
        model.timeSecondDay = schoolGroup.getSchecule().getTimes().get(model.secondDayOfClassInWeek);
        model.updatedAt = schoolGroup.getUpdatedAt();
        if(schoolGroup.getStudents()){
            model.students = StudentEntity.toStudentsEntities(schoolGroup.getStudents());
        }
        if(schoolGroup.getTeacher()){
            model.setTeacher(WorkerEntity.toWorkerEntity(schoolGroup.getTeacher()));
        }
        return model;
    }

    setStudents(student: StudentEntity){
        if(!this.students){
            this.students = [];
        }
        this.students.push(student);
    }

    setTeacher(teacher: WorkerEntity){
        this.teacher = teacher;
    }
}