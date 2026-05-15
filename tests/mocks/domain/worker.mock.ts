import { RoleEnum } from '../../../src/domain/worker/roleEnum';
import { Class } from '../../../src/domain/class/class';
import { Worker } from '../../../src/domain/worker/worker';

type WorkerMock = {
    role?: RoleEnum;
    classes?: Class;
    birthday?: Date;
    name?: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

function teacherWithJustName(overrides: WorkerMock): Worker{
    const w = new Worker({ 
        name: overrides.name ?? 'maria', 
        role: RoleEnum.TEACHER,
    });
    const c = overrides.classes || null;
    w.setClass(c);
    return w;
}

function teacher(overrides: WorkerMock): Worker{
    const w = new Worker({ 
        birthday: overrides.birthday ?? new Date(), 
        name: overrides.name ?? 'juliana', 
        role: overrides.role ?? RoleEnum.TEACHER 
    });
    const c = overrides.classes || null;
    w.setClass(c);
    return w;
}

/**
 * by default returns a teacher
 * @param overrides 
 * @param role 
 * @param justName 
 */
export function mockWorker(
    overrides: WorkerMock = {}, justName: boolean = false
) : Worker {
    if(justName) return teacherWithJustName(overrides);
    return teacher(overrides);
}