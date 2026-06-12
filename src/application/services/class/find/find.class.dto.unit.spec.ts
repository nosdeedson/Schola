import { Class } from "../../../../domain/class/class";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import {FindClassScheduleDto, FindClassDto, FindClassTeacherDto, FindClassStudentDto} from './find.class.dto'
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";


describe('find dto unit test', () => {

    afterEach(() =>{
        jest.clearAllMocks();
    })

    it('should return a dto of FindClassDto', () =>{
        const schoolgroup = mockClass();
        let classDto = FindClassDto.toDto(schoolgroup);
        expect(classDto).toBeDefined();
        expect(classDto.classCode).toBe(schoolgroup.getClassCode());
        expect(classDto.name).toEqual(schoolgroup.getName());
        expect(classDto.nameBook).toEqual(schoolgroup.getNameBook());
        expect(classDto.schedule).toBeDefined();
        expect(classDto.teacher).toStrictEqual(new FindClassTeacherDto());
        expect(classDto.students.length).toBe(0);
    });

    it('should return a dto of FindClassDto with students and teacher', () =>{
        const schoolgroup = mockClass();
        let worker = mockWorker()
        schoolgroup.setTeacher(worker);
                
        let student = mockStudent()
        schoolgroup.setStudents([student]);

        let classDto = FindClassDto.toDto(schoolgroup);
        
        expect(classDto).toBeDefined();
        expect(classDto.classCode).toBe(schoolgroup.getClassCode());
        expect(classDto.name).toEqual(schoolgroup.getName());
        expect(classDto.nameBook).toEqual(schoolgroup.getNameBook());
        expect(classDto.schedule).toBeDefined();

        expect(classDto.teacher.id).toEqual(worker.getId());
        expect(classDto.teacher.name).toEqual(worker.getName());
        
        expect(classDto.students.length).toBe(1);
        expect(classDto.students[0].id).toEqual(student.getId());
        expect(classDto.students[0].name).toEqual(student.getName());

    });

    it('should return a dto of ClassTeacherDto', () =>{
        const schoolgroup = mockClass();
        let worker = mockWorker()
        schoolgroup.setTeacher(worker);
        let teacher = FindClassTeacherDto.toDto(schoolgroup.getTeacher());
        expect(teacher).toBeDefined();
        expect(teacher.id).toEqual(schoolgroup.getTeacher().getId());
        expect(teacher.name).toEqual(schoolgroup.getTeacher().getName());
    });

    it('should return a dto of ClassTeacherDto with undefined attributes', () =>{
        const schoolgroup = mockClass();
        let teacher = FindClassTeacherDto.toDto(schoolgroup.getTeacher());
        expect(teacher).toBeDefined();
        expect(teacher.id).toBeUndefined();
        expect(teacher.name).toBeUndefined();
    });

    it('should return a dto of ClassStudentDto', () =>{
        const schoolgroup = mockClass();
        let student = mockStudent()
        schoolgroup.setStudents([student]);
        let students = FindClassStudentDto.toDto(schoolgroup.getStudents());
        expect(students).toBeDefined();
        expect(students.length).toBe(1);
        expect(students[0].id).toEqual(student.getId());
        expect(students[0].name).toEqual(student.getName());
    })

    it('should return a dto of ClassStudentDto with undefined attributes', () =>{
        const schoolgroup = mockClass();
        let students = FindClassStudentDto.toDto(schoolgroup.getStudents());
        expect(students).toBeDefined();
        expect(students.length).toBe(0);
        expect(students[0]).toBeUndefined();
    });

    it('should return a dto of ClassScheduleDto', () =>{
        const schoolgroup = mockClass();
        let schedule = FindClassScheduleDto.toDto(schoolgroup);
        expect(schedule).toBeDefined();
        expect(schedule.dayOfWeeks.length).toBe(2);
        expect(schedule.dayOfWeeks).toEqual(schoolgroup.getSchecule().getDayOfWeek());
        expect(schedule.times).toEqual(Object.fromEntries(schoolgroup.getSchecule().getTimes()));
    });
});