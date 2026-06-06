import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserFactoryService } from './delete-user-factory.service';
import { DataBaseConnectionModule } from '../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { AccessType } from '../../../domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { RepositoryFactoryService } from '../repositiry-factory/repository-factory.service';
import { SystemError } from '../../../application/services/@shared/system-error';
import { DeleteParentService } from '../../../application/services/parent/delete/delete.parent.service';
import { DeleteStudentService } from '../../../application/services/student/delete/delete.student.service';
import { DeleteWorkerService } from '../../../application/services/worker/delete/delete.worker.service';
import { StudentRepository } from '@/infrastructure/repositories/student/student.repository';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { ParentRepository } from '@/infrastructure/repositories/parent/parent.repository';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';
import { WorkerRepository } from '@/infrastructure/repositories/worker/worker.repository';

describe('DeleteUserFactoryService', () => {
  let service: DeleteUserFactoryService;
  let userAggregateResolver: jest.Mocked<UserAggregateResolverService>;
  beforeEach(async () => {
    userAggregateResolver = {
      resolve: jest.fn()
    } as any;
    service = new DeleteUserFactoryService(userAggregateResolver);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a DeleteParentService instance', () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.PARENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository,
    });
    const deleteParentService = service.deleteUserServiceFactory(AccessType.PARENT);
    expect(deleteParentService).toBeInstanceOf(DeleteParentService);
  });

  it('shoult return a DeleteStudent instance', () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.STUDENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository,
    });
    const deleteStudentService = service.deleteUserServiceFactory(AccessType.STUDENT);
    expect(deleteStudentService).toBeInstanceOf(DeleteStudentService);
  });

  it('should return a DeleteWorkerService instance of worker', () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.TEACHER,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository,
    });
    const deleteWorkerService = service.deleteUserServiceFactory(AccessType.TEACHER);
    expect(deleteWorkerService).toBeInstanceOf(DeleteWorkerService);
  });

  it('should return a DeleteWorkerService instance of admin', () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.ADMIN,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository,
    });
    const deleteWorkerService = service.deleteUserServiceFactory(AccessType.ADMIN);
    expect(deleteWorkerService).toBeInstanceOf(DeleteWorkerService);
  });

  it('should throw a SystemErro from aggregateResolver', async () => {
    const error = new SystemError([{ context: 'UserAggregateResolver', message: 'Invalid access type' },], 400);
    userAggregateResolver.resolve.mockImplementation(() => { throw error });
    expect(() => service.deleteUserServiceFactory('NOT_EXIST' as AccessType))
      .toThrow(SystemError);
  });

});
