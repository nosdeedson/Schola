import { Class } from "../../../../domain/class/class";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import {FindClassScheduleDto, FindClassDto, FindClassTeacherDto, FindClassStudentDto} from './find.class.dto'

describe('find dto unit test', () => {

    let schoolgroup: Class;

    beforeEach(() =>{
        schoolgroup = DomainMocks.mockSchoolGroup();
    })

    afterEach(() =>{
        jest.clearAllMocks();
    })

    it('should return a dto of FindClassDto', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let classDto = FindClassDto.toDto(entity);
        expect(classDto).toBeDefined();
        expect(classDto.classCode).toBe(entity.classCode);
        expect(classDto.name).toEqual(entity.className);
        expect(classDto.nameBook).toEqual(entity.bookName);
        expect(classDto.schedule).toBeDefined();
        expect(classDto.teacher).toStrictEqual(new FindClassTeacherDto());
        expect(classDto.students.length).toBe(0);
    });

    it('should return a dto of FindClassDto with students and teacher', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let workerEntity = WorkerEntity.toWorkerEntity(worker);
        entity.setTeacher(workerEntity);
                
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        entity.setStudents(studentEntity);

        let classDto = FindClassDto.toDto(entity);
        
        expect(classDto).toBeDefined();
        expect(classDto.classCode).toBe(entity.classCode);
        expect(classDto.name).toEqual(entity.className);
        expect(classDto.nameBook).toEqual(entity.bookName);
        expect(classDto.schedule).toBeDefined();

        expect(classDto.teacher.id).toEqual(worker.getId());
        expect(classDto.teacher.name).toEqual(worker.getName());
        
        expect(classDto.students.length).toBe(1);
        expect(classDto.students[0].id).toEqual(student.getId());
        expect(classDto.students[0].name).toEqual(student.getName());

    });

    it('should return a dto of ClassTeacherDto', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let workerEntity = WorkerEntity.toWorkerEntity(worker);
        entity.setTeacher(workerEntity);
        let teacher = FindClassTeacherDto.toDto(entity.teacher);
        expect(teacher).toBeDefined();
        expect(teacher.id).toEqual(entity.teacher.id);
        expect(teacher.name).toEqual(entity.teacher.fullName);
    });

    it('should return a dto of ClassTeacherDto with undefined attributes', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let teacher = FindClassTeacherDto.toDto(entity.teacher);
        expect(teacher).toBeDefined();
        expect(teacher.id).toBeUndefined();
        expect(teacher.name).toBeUndefined();
    });

    it('should return a dto of ClassStudentDto', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        entity.setStudents(studentEntity);
        let students = FindClassStudentDto.toDto(entity.students);
        expect(students).toBeDefined();
        expect(students.length).toBe(1);
        expect(students[0].id).toEqual(student.getId());
        expect(students[0].name).toEqual(student.getName());
    })

    it('should return a dto of ClassStudentDto with undefined attributes', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let students = FindClassStudentDto.toDto(entity.students);
        expect(students).toBeDefined();
        expect(students.length).toBe(0);
        expect(students[0]).toBeUndefined();
    });

    it('should return a dto of ClassScheduleDto', () =>{
        let entity = ClassEntity.toClassEntity(schoolgroup);
        let schedule = FindClassScheduleDto.toDto(entity);
        expect(schedule).toBeDefined();
        expect(schedule.dayOfWeeks.length).toBe(2);
        expect(schedule.dayOfWeeks[0]).toEqual(entity.firstDayOfClassInWeek);
        expect(schedule.dayOfWeeks[1]).toEqual(entity.secondDayOfClassInWeek);
        expect(schedule.times[entity.firstDayOfClassInWeek]).toEqual(entity.timeFirstDay);
        expect(schedule.times[entity.secondDayOfClassInWeek]).toEqual(entity.timeSecondDay);

    });
})