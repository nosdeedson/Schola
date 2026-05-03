import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { Entity } from "../@shared/entity";
import { Schedule } from "../schedule/schedule";
import { Student } from "../student/student";
import { Worker } from '../worker/worker';
import { ClassValidator } from './class.validator';

export class Class extends Entity {

    private classCode: string;
    private nameBook: string;
    private name: string;
    private schedule: Schedule;
    private teacher: Worker;
    private students: Student[];

    constructor(
        classCode: string,
        nameBook: string,
        name: string,
        schedule: Schedule,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date
    ) {
        super(id, createdAt, updatedAt, deletedAt);
        this.classCode = classCode;
        this.nameBook = nameBook;
        this.name = name;
        this.schedule = schedule;
        this.students = [];
        this.validate();
    }

    validate() {
        new ClassValidator().validate(this);
    }

    getClassCode(): string {
        return this.classCode;
    }

    setClassCode(code: string) {
        this.classCode = code;
        this.validate();
    }

    getNameBook(): string {
        return this.nameBook;
    }

    setNameBook(nameBook: string) {
        this.nameBook = nameBook;
        this.validate();
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
        this.validate();
    }

    getTeacher(): Worker {
        return this.teacher;
    }

    setTeacher(teacher: Worker) {
        this.teacher = teacher;
    }

    getStudents(): Student[] {
        return this.students;
    }

    setStudent(student: Student) {
        this.students.push(student);
    }

    setStudents(students: Student[]) {
        students.forEach(it => this.setStudent(it));
    }

    getSchecule(): Schedule {
        return this.schedule;
    }

    setSchecule(schedule: Schedule) {
        this.schedule = schedule;
        this.validate();
    }

    static from(entity: ClassEntity): Class {
        const schedule = Schedule.from({
            dayOfWeeks: [entity.firstDayOfClassInWeek, entity.secondDayOfClassInWeek],
            times: new Map([
                [entity.firstDayOfClassInWeek, entity.timeFirstDay],
                [entity.secondDayOfClassInWeek, entity.timeSecondDay]
            ])
        })
        const c = new Class(
            entity.classCode,
            entity.bookName,
            entity.className,
            schedule,
            entity.id,
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt,
        );
        return c;
    }
}
