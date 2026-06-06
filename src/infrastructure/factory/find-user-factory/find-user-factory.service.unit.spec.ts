import { Test, TestingModule } from '@nestjs/testing';
import { FindUserFactoryService } from './find-user-factory.service';
import { DataBaseConnectionModule } from '../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { UserAggregateContext, UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { RepositoryFactoryService } from '../repositiry-factory/repository-factory.service';
import { AccessType } from '../../../domain/user/access.type';
import { SystemError } from '../../../application/services/@shared/system-error';
import { FindParentService } from '../../../application/services/parent/find/find.parent.service';
import { FindStudentService } from '../../../application/services/student/find/find.student.service';
import { FindWorkerService } from '../../../application/services/worker/find/find.worker.service';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { ParentRepository } from '@/infrastructure/repositories/parent/parent.repository';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';
import { StudentRepository } from '@/infrastructure/repositories/student/student.repository';
import { WorkerRepository } from '@/infrastructure/repositories/worker/worker.repository';

describe('FindUserFactoryService', () => {
  let service: FindUserFactoryService;
  let userAggregateResolver: jest.Mocked<UserAggregateResolverService>;

  beforeAll(async () => {
    userAggregateResolver = {
      resolve: jest.fn()
    } as any;
    service = new FindUserFactoryService(userAggregateResolver);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a FindParentService', async () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.PARENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository
    }) as any;
    const findParentService = await service.findUserServiceFactory(AccessType.PARENT);
    expect(findParentService).toBeInstanceOf(FindParentService);
  });

  it('should return a FindStudentService', async () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.STUDENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository
    }) as any;
    const findStudentService = await service.findUserServiceFactory(AccessType.STUDENT);
    expect(findStudentService).toBeInstanceOf(FindStudentService);
  });

  it('should return a FindWorkerService as teacher', async () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.TEACHER,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository
    })
    const findWorkerService = await service.findUserServiceFactory(AccessType.TEACHER);
    expect(findWorkerService).toBeInstanceOf(FindWorkerService);
  });

  it('should return a FindWorkerService as admin', async () => {
    userAggregateResolver.resolve.mockReturnValue({
      accessType: AccessType.ADMIN,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository
    })
    const findWorkerService = await service.findUserServiceFactory(AccessType.ADMIN);
    expect(findWorkerService).toBeInstanceOf(FindWorkerService);
  });

  it('should throw a SystemError from aggegateResolver', async () => {
    const error = new SystemError([{ context: 'UserAggregateResolver', message: 'Invalid access type' },], 400);
    userAggregateResolver.resolve.mockImplementation(() => { throw error });
    await expect(service.findUserServiceFactory('NO_EXIXT' as AccessType))
      .rejects.toMatchObject({
        errors: [
          {
            context: 'UserAggregateResolver',
            message: 'Invalid access type'
          }
        ],
        statusCode: 400
      })
  });
});
