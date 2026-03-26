import { DateHelper } from "../../helpers/date/date.helper";
import { Class } from "../class/class";
import { Schedule } from "../schedule/schedule";
import { RoleEnum } from "./roleEnum";
import { Worker } from "./worker";

describe('Teacher unit test', () =>{

    let schedule: Schedule;

    beforeEach(() =>{
        // date of the year: august 9 2024
        let aValidDate = new Date(2024, 7, 9, 17, 5, 0, 0);
        let aValidDate2 = new Date(2024, 7, 8, 17, 5, 0, 0);
        let firstDay = DateHelper.getDayOfweek(aValidDate);
        let secondDay =  DateHelper.getDayOfweek(aValidDate2);
        let times = new Map();
        DateHelper.setTime(times, firstDay, '08:00');
        DateHelper.setTime(times, firstDay, '08:00');
        schedule = new Schedule(
            [firstDay, secondDay],
            times
        )
    })

    it('should instantiate a Teacher', () =>{
        const expectedBirthDay = new Date();
        const expectedName = 'edson';
        const expectedRole = RoleEnum.TEACHER;
        const teacher = new Worker({ birthday: expectedBirthDay, name: expectedName, role: expectedRole});

        expect(teacher.getId()).toBeDefined();
        expect(teacher.getName()).toBeDefined();
        expect(teacher.getRole()).toEqual(RoleEnum.TEACHER);
        expect(teacher.getBirthday()).toBeDefined();
        expect(teacher.getCreatedAt()).toBeDefined();
        expect(teacher.getUpdatedAt()).toBeDefined();
        expect(teacher.getDeletedAt()).toBeUndefined();
        expect(teacher.getClasses()).toBeUndefined();
    })

    it('should instantiate a worker with administrator', () =>{
        const expectedBirthDay = new Date();
        const expectedName = 'edson';
        const expectedRole = RoleEnum.ADMINISTRATOR;
        const teacher = new Worker({ birthday: expectedBirthDay, name: expectedName, role: expectedRole});

        expect(teacher.getId()).toBeDefined();
        expect(teacher.getName()).toBeDefined();
        expect(teacher.getRole()).toEqual(RoleEnum.ADMINISTRATOR);
        expect(teacher.getBirthday()).toBeDefined();
        expect(teacher.getCreatedAt()).toBeDefined();
        expect(teacher.getUpdatedAt()).toBeDefined();
        expect(teacher.getDeletedAt()).toBeUndefined();
    })

    it('should have error if name empty', () =>{
        const expectedBirthDay = new Date();
        const expectedRole = RoleEnum.TEACHER;
        const teacher = new Worker({birthday: expectedBirthDay, name: '', role: expectedRole});
        expect(teacher.notification?.getErrors().length).toBe(1)
        expect(teacher.notification?.getErrors()[0].message).toBe('Name should not be null')
        expect(teacher.notification?.messages('teacher')).toBe('teacher: Name should not be null,')
    });

    it('should have error if role empty', () =>{
        const expectedBirthDay = new Date();
        const name = 'edson';
        let expectedRole;
        const teacher = new Worker({birthday:expectedBirthDay, name, role: expectedRole as any});
        expect(teacher.notification?.getErrors().length).toBe(1)
        expect(teacher.notification?.getErrors()[0].message).toBe('Role should not be null')
        expect(teacher.notification?.messages('teacher')).toBe('teacher: Role should not be null,')
    })

    it('should have 3 errors ', () =>{
        let expectedBirthDay;
        let name;
        let expectedRole;
        const teacher = new Worker({birthday: expectedBirthDay as any, name: name as any, role: expectedRole as any});
        expect(teacher.notification?.getErrors().length).toBe(2)
        expect(teacher.notification?.getErrors()[0].message).toBe('Name should not be null')
        expect(teacher.notification?.getErrors()[1].message).toBe('Role should not be null')
        expect(teacher.notification?.messages('teacher')).toBe('teacher: Name should not be null,teacher: Role should not be null,')
    });

    it('should instantiate a Teacher with one class', () =>{
         // date of the year: august 9 2024
         const aValidDate = new Date(2024, 7, 9, 17, 5, 0, 0);
        const c = new Class(
            '123',
            'book',
            'A1',
            schedule,
        )

        const expectedBirthDay = new Date();
        const expectedName = 'edson';
        const expectedRole = RoleEnum.TEACHER;
        const teacher = new Worker({birthday: expectedBirthDay, name: expectedName, role: expectedRole});
        teacher.setClass(c);

        expect(teacher.getId()).toBeDefined();
        expect(teacher.getName()).toBeDefined();
        expect(teacher.getRole()).toEqual(RoleEnum.TEACHER);
        expect(teacher.getBirthday()).toBeDefined();
        expect(teacher.getCreatedAt()).toBeDefined();
        expect(teacher.getUpdatedAt()).toBeDefined();
        expect(teacher.getDeletedAt()).toBeUndefined();
        expect(teacher.getClasses().length).toBe(1)
    })

})