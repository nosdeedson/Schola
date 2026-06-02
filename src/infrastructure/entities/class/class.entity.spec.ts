import { Student } from "../../../domain/student/student";
import { Class } from "../../../domain/class/class";
import { Schedule } from "../../../domain/schedule/schedule";
import { DateHelper } from "../../../helpers/date/date.helper";
import { ClassEntity } from "./class.entity";
import { StudentEntity } from "../student/student.entity";
import { Worker } from "../../../domain/worker/worker";
import { RoleEnum } from "../../../domain/worker/roleEnum";
import { WorkerEntity } from "../worker/worker.entity";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { mockWorker } from "../../../../tests/mocks/domain/worker.mock";

describe('Classmodel unit tests', () => {

    let schedule: Schedule;
    let aValidDate: Date;
    let aValidDate2: Date;
    let c: Class;
    let student: Student;
    let teacher: Worker;

    afterEach(() =>{
        schedule = undefined;
        aValidDate = undefined;
        aValidDate2 = undefined;
        c = undefined;
    })

    beforeEach(() =>{
         // date of the year: august 9 2024 Friday
         let aValidDate = new Date(2024, 7, 9, 17, 5, 0, 0);
         let aValidDate2 = new Date(2024, 7, 8, 17, 5, 0, 0);
 
         let firstDay = DateHelper.getDayOfweek(aValidDate); 
         let secondDay = DateHelper.getDayOfweek(aValidDate2); 
 
         let times = new Map();
         DateHelper.setTime(times, firstDay, '08:00');
         DateHelper.setTime(times, secondDay, '08:00');
 
         let schedule = new Schedule(
             [firstDay, secondDay],
             times
         )

        c = new Class(
            '123',
            'book',
            'A1',
            schedule,
        );

        student = mockStudent();
        teacher = mockWorker();
    })

    it('should instantiate a ClassEntity from a domain Class', () => {
        
        const model = ClassEntity.toClassEntity(c);
        expect(model).toBeDefined();
        expect(model.bookName).toEqual(c.getNameBook());
        expect(model.classCode).toEqual(c.getClassCode());
        expect(model.createdAt).toEqual(c.getCreatedAt());
        expect(model.deletedAt).toEqual(c.getDeletedAt());
        expect(model.id).toEqual(c.getId());
        expect(model.className).toEqual(c.getName());
        const firstDayOfWeek = c.getSchecule().getDayOfWeek()[0];
        const secondDayOfWeek = c.getSchecule().getDayOfWeek()[1];
        expect(model.firstDayOfClassInWeek).toEqual(firstDayOfWeek);
        expect(model.secondDayOfClassInWeek).toEqual(secondDayOfWeek);
        const firstTime = c.getSchecule().getTime(firstDayOfWeek)
        const secondTime = c.getSchecule().getTime(secondDayOfWeek)
        expect(model.timeFirstDay).toEqual(firstTime);
        expect(model.timeSecondDay).toEqual(secondTime);
        expect(model.updatedAt).toEqual(c.getUpdatedAt());
    })

    it('should set a teacheer to schoolgroup', () => {
        const model =ClassEntity.toClassEntity(c);
        const teacherModel = WorkerEntity.toWorkerEntity(teacher, model)
        model.setTeacher(teacherModel)
        expect(model).toBeDefined();
        expect(model.teacher).toStrictEqual(teacherModel);
    })

    it('should set a student to schoolgroup', () => {
        const model = ClassEntity.toClassEntity(c);
        const studentModel = StudentEntity.toStudentEntity(student); 
        model.setStudents(studentModel);
        expect(model).toBeDefined();
        expect(model.students.length).toBe(1)
        expect(model.students).toStrictEqual([studentModel]);
    });

    it('should set an empty array of student in class', () => {
        const model = ClassEntity.toClassEntity(c);
        delete model.students;
        model.setStudents(null);
        expect(model.students).toHaveLength(1);
    });
});