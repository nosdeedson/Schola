import { AccessType } from '../../../src/domain/user/access.type';
import { User } from '../../../src/domain/user/user';
import { mockWorker } from '../domain/worker.mock';
import { mockParent } from '../domain/parent.mocks';
import { mockStudent } from '../domain/student.mocks';
import { UserEntity } from '@/infrastructure/entities/user/user.entity';

const userAdmin = new User(mockWorker(), 'teste@teste', 'edson', '123', AccessType.ADMIN);
const userParent = new User(mockParent(), 'teste@teste', 'edson', '123', AccessType.PARENT);
const userStudent = new User(mockStudent(), 'teste@teste', 'edson', '123', AccessType.STUDENT);
const userTeacher = new User(mockWorker(), 'teste@teste', 'edson', '123', AccessType.TEACHER);

export function mockPerson(accessType: AccessType): User {
    if (accessType == AccessType.ADMIN) {
        return userAdmin;
    } else if (accessType == AccessType.PARENT) {
        return userParent;
    } else if (accessType == AccessType.STUDENT) {
        return userStudent;
    } else if(accessType === AccessType.TEACHER){
        return userTeacher;
    }  else {
        return new User(mockWorker(), 'teste@teste', 'edson', '123', "NOT_VALID" as any); 
    }
}