import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { mockParent } from "../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../tests/mocks/domain/student.mocks";
import { Student } from "../student/student";
import { Parent } from "./parent";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

describe('Parent unit tests', () => {

    it('should intantiate a Parent', () => {
        let birthday = new Date();
        let name = 'Maria';
        let nameStudents = ['Edson', 'mary'];
        let parent = new Parent({
            name,
            birthday,
            nameStudents: nameStudents
        });

        expect(parent.getId()).toBeDefined();
        expect(parent.getName()).toBeDefined();
        expect(parent.getBirthday()).toBeDefined();
        expect(parent.getCreatedAt()).toBeDefined();
        expect(parent.getUpdatedAt()).toBeDefined();
        expect(parent.getDeletedAt()).toBeUndefined();
        expect(parent.getStudents()).toBeDefined();
        expect(parent.getStudents().length).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(parent.getStudents())).toBeTruthy();
        expect(parent.getStudents()[0].getName()).toBe('Edson');
        expect(parent.getStudents()[0].getId()).toBeDefined();
    });

    it('should have error if name empty', () => {
        let birthday = new Date();
        let name;
        let nameStudents = ['Edson', 'mary'];
        let parent = new Parent({ name: name as any, birthday, nameStudents });

        expect(parent.notification?.getErrors().length).toBe(1)
        expect(parent.notification?.getErrors()[0].message).toBe('Name should not be null')
        expect(parent.notification?.messages('parent')).toBe('parent: Name should not be null,')
    });

    it('should have error if birthday empty', () => {
        let birthday;
        let name = 'edson';
        let nameStudents = ['Edson', 'mary'];
        let parent = new Parent({ name: name as any, birthday, nameStudents });

        expect(parent.notification?.getErrors().length).toBe(1)
        expect(parent.notification?.getErrors()[0].message).toBe('Birthday should not be null')
        expect(parent.notification?.messages('parent')).toBe('parent: Birthday should not be null,')
    });

    it('should have error if student empty', () => {
        let birthday = new Date();
        let name = 'edson';
        let nameStudents = [] as any;
        let parent = new Parent({ name: name as any, birthday, nameStudents });

        expect(parent.notification?.getErrors().length).toBe(1)
        expect(parent.notification?.getErrors()[0].message).toBe('students field must have at least 1 items')
        expect(parent.notification?.messages('parent')).toBe('parent: students field must have at least 1 items,')
    });

    it('should create a parent with just name', () => {
        let parent = Parent.createMyChild('edson');
        expect(parent).toBeDefined();
        expect(parent.getId()).toBeDefined();
        expect(parent.getName()).toBe('edson');
        expect(parent).toBeInstanceOf(Student);
    });

    it('should create a list of student for the parent', () => {
        let students = Parent.createMyChildren(['edson', 'maria']);
        expect(students).toBeDefined();
        expect(students.length).toBe(2);
        expect(students[0]).toBeInstanceOf(Student);
        expect(students[1]).toBeInstanceOf(Student);
        expect(students[0].getName()).toBe('edson');
        expect(students[1].getName()).toBe('maria');
    });

    it('should convert a parentEntity to a domain parent', () => {
        const parent = mockParent();
        const parentEntity = ParentEntity.toParentEntity(parent);
        const toDomain = Parent.toDomain(parentEntity);
        expect(toDomain).toBeDefined();
        expect(toDomain.getId()).toBe(parentEntity.id);
    });

    it('should set the students of a parent', () => {
        let parent = mockParent();
        const student = mockStudent()
        parent.setStudents([student])
        expect(parent).toBeDefined();
        expect(parent.getStudents()).toStrictEqual([student]);
    });
});