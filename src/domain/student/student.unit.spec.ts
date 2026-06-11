import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockRating } from "../../../tests/mocks/domain/rating.mocks";
import { mockStudent } from "../../../tests/mocks/domain/student.mocks";
import { Parent } from "../parent/parent";
import { RoleEnum } from "../worker/roleEnum";
import { Student } from "./student";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { mockParent } from "../../../tests/mocks/domain/parent.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";

describe("student unit tests", () =>{

    it('should instantiate a student', () =>{
        let nameParents = ['maria'];
        let birthday = new Date();
        let name = 'edson';
        let enrolled = '123'
        let student = new Student({birthday: birthday, name: name, enrolled: enrolled, nameParents: nameParents});
        

        expect(student.getId()).toBeDefined();
        expect(student.getName()).toBeDefined();
        expect(student.getBirthday()).toBeDefined();
        expect(student.getCreatedAt()).toBeDefined();
        expect(student.getUpdatedAt()).toBeDefined();
        expect(student.getDeletedAt()).toBeUndefined();
        expect(student.getEnrolled()).toBeDefined();
        expect(student.getParents()).toBeDefined();
        expect(student.getParents().length).toBeGreaterThan(0);
    });

    it('should have error if name empty', () =>{
        let birthday = new Date();
        let name;
        const nameParents = ['maria'];
        let enrolled = '123'
        let student = new Student({birthday: birthday, name: name as any, enrolled: enrolled, nameParents});

        expect(student.notification?.getErrors().length).toBe(1)
        expect(student.notification?.getErrors()[0].message).toBe('Name should not be null')
        expect(student.notification?.messages('student')).toBe('student: Name should not be null,')
    })

    it('should have error if birthday empty', () =>{
        let birthday;
        let name = 'edson';
        const nameParents = ['maria'];
        let enrolled = '123'
        let student = new Student({birthday: birthday as any, name: name, enrolled: enrolled, nameParents});

        expect(student.notification?.getErrors().length).toBe(1)
        expect(student.notification?.getErrors()[0].message).toBe('Birthday should not be null')
        expect(student.notification?.messages('student')).toBe('student: Birthday should not be null,')
    })

    it('should have error if enrolled empty', () =>{
        let birthday = new Date();
        let name = 'edson';
        let nameParents = ['Maria'];
        let enrolled; 
        let student = new Student({birthday, name, nameParents, enrolled: enrolled as any});

        expect(student.notification?.getErrors().length).toBe(1)
        expect(student.notification?.getErrors()[0].message).toBe('Enrolled should not be null')
        expect(student.notification?.messages('student')).toBe('student: Enrolled should not be null,')
    })

    it('should have error if parents empty', () =>{
        let birthday = new Date();
        let name = 'edson';
        let enrolled = '123';
        let nameParents = [] as any;
        let student = new Student({birthday, name, enrolled, nameParents});

        expect(student.notification?.getErrors().length).toBe(1)
        expect(student.notification?.getErrors()[0].message).toBe('parents field must have at least 1 items')
        expect(student.notification?.messages('student')).toBe('student: parents field must have at least 1 items,')
    })

    it('should have two errors', () =>{
        let birthday;
        let name;
        const nameParents = ['maria'];
        let enrolled = '123'
        let student = new Student({birthday: birthday as any, name: name as any, enrolled: enrolled, nameParents} );

        expect(student.notification?.getErrors().length).toBe(2)
        expect(student.notification?.getErrors()[0].message).toBe('Name should not be null')
        expect(student.notification?.getErrors()[1].message).toBe('Birthday should not be null')
        expect(student.notification?.messages('student')).toBe('student: Name should not be null,student: Birthday should not be null,')
    });

    it('should create a student with just a name', () => {
        let result = Student.createMyParent('edson');
        expect(result).toBeDefined();
        expect(result.getName()).toBe('edson');
        expect(result.getId()).toBeDefined();
        expect(result).toBeInstanceOf(Parent);
    });

    it('should return an array of students', () => {
        let results = Student.createMyParents(['edson', 'Marie']);
        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(2);
        expect(results[0].getName()).toBe('edson');
        expect(results[1].getName()).toBe('Marie');
        expect(results[0].getId()).toBeDefined();
        expect(results[1].getId()).toBeDefined();
        expect(results[0]).toBeInstanceOf(Parent);
        expect(results[1]).toBeInstanceOf(Parent);
    });

    it('should get the ratings of a student', () => {
        const student = mockStudent();
        expect(student.getRating()).toBeUndefined();
    });

    it('should convert studentEntity to domain student', () => {
        const studentEntity = StudentMapper.fromDomain(mockStudent());
        studentEntity.parents.push(ParentMapper.fromDomain(mockParent()));
        const toDomain = Student.toDomain(studentEntity);
        expect(toDomain).toBeDefined();
        expect(toDomain.getId()).toBe(studentEntity.id);
    });

});