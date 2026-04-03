import { Inject, Injectable } from '@nestjs/common';
import { SystemError } from 'src/application/services/@shared/system-error';
import { AccessType } from '@/domain/user/access.type';
import { ClassEntity } from '@/infrastructure/entities/class/class.entity';
import { ParentEntity } from '@/infrastructure/entities/parent/parent.entity';
import { StudentEntity } from '@/infrastructure/entities/student/student.entity';
import { WorkerEntity } from '@/infrastructure/entities/worker/worker.entity';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { ParentRepository } from '@/infrastructure/repositories/parent/parent.repository';
import { StudentRepository } from '@/infrastructure/repositories/student/student.repository';
import { WorkerRepository } from '@/infrastructure/repositories/worker/worker.repository';
import { DataSource } from 'typeorm';
import { RepositoryFactoryService } from '../repositiry-factory/repository-factory.service';
import { TypeRepository } from '../repositiry-factory/type-repository';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';

export interface ParentStudentAggregateContext {
    accessType: AccessType.STUDENT | AccessType.PARENT;
    studentRepository: StudentRepository;
    classRepository: ClassRepository;
    parentRepository: ParentRepository;
    parentStudentRepository: ParentStudentRepository;
}

export interface WorkerAggregateContext {
    accessType: AccessType.TEACHER | AccessType.ADMIN;
    workerRepository: WorkerRepository;
    classRepository: ClassRepository;
}

export type UserAggregateContext =
 | ParentStudentAggregateContext
 | WorkerAggregateContext;

@Injectable()
export class UserAggregateResolverService {
    constructor(private repositoryFactory: RepositoryFactoryService){ }

    resolve(accessType: AccessType): UserAggregateContext {
        switch(accessType){
            case AccessType.PARENT:
            case AccessType.STUDENT:
                return {
                    accessType: accessType,
                    studentRepository: this.repositoryFactory.createRepository(TypeRepository.STUDENT) as StudentRepository,
                    classRepository: this.repositoryFactory.createRepository(TypeRepository.CLASS) as ClassRepository,
                    parentRepository: this.repositoryFactory.createRepository(TypeRepository.PARENT) as ParentRepository,
                    parentStudentRepository: this.repositoryFactory.createRepository(TypeRepository.PARENT_STUDENT) as ParentStudentRepository,
                };
            case AccessType.TEACHER:
            case AccessType.ADMIN:
                return {
                    accessType: accessType,
                    workerRepository: this.repositoryFactory.createRepository(TypeRepository.WORKER) as WorkerRepository,
                    classRepository: this.repositoryFactory.createRepository(TypeRepository.CLASS) as ClassRepository,
                };
            default:
                throw new SystemError([{ context: 'UserAggregateResolver', message: 'Invalid access type' },]);
        }
    }; 
}
