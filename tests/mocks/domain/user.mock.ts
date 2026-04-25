import { AccessType } from '../../../src/domain/user/access.type';
import { RoleEnum } from '../../../src/domain/worker/roleEnum';
import { Worker } from '../../../src/domain/worker/worker';
import { Parent } from '../../../src/domain/parent/parent';
import { Student } from '../../../src/domain/student/student';
import { User } from '../../../src/domain/user/user';

const admin = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.ADMINISTRATOR });
const parent = new Parent({ name: "jose", nameStudents: ['edson'], birthday: new Date(), });
const student = new Student({ birthday: new Date, name: 'robert', enrolled: '123', nameParents: [parent.getName()] });
const teacher = new Worker({ birthday: new Date(), name: 'juliana', role: RoleEnum.TEACHER });

const userAdmin = new User(admin, 'teste@teste', 'edson', '123', AccessType.ADMIN);
const userParent = new User(parent, 'teste@teste', 'edson', '123', AccessType.PARENT);
const userStudent = new User(student, 'teste@teste', 'edson', '123', AccessType.STUDENT);
const userTeacher = new User(teacher, 'teste@teste', 'edson', '123', AccessType.TEACHER);

export function mockUser(accessType: AccessType): User {
    switch (accessType) {
        case AccessType.ADMIN:
            return userAdmin;
        case AccessType.PARENT:
            return userParent;
        case AccessType.STUDENT:
            return userStudent;
        case AccessType.TEACHER:
            return userTeacher;
        default:
            return userAdmin;
    }
}
