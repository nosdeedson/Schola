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

describe('FindUserFactoryService', () => {
  let service: FindUserFactoryService;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      providers: [
        FindUserFactoryService,
        UserAggregateResolverService,
        RepositoryFactoryService
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    service = module.get<FindUserFactoryService>(FindUserFactoryService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a FindParentService', async () => {
    const findParentService = await service.findUserServiceFactory(AccessType.PARENT);
    expect(findParentService).toBeInstanceOf(FindParentService);
  });

  it('should return a FindStudentService', async () => {
    const findStudentService = await service.findUserServiceFactory(AccessType.STUDENT);
    expect(findStudentService).toBeInstanceOf(FindStudentService);
  });

  it('should return a FindWorkerService', async () => {
    const findWorkerService = await service.findUserServiceFactory(AccessType.TEACHER);
    expect(findWorkerService).toBeInstanceOf(FindWorkerService);
  });

  it('should throw a SystemError from aggegateResolver', async () => {
    try {
      await service.findUserServiceFactory('NO_EXIXT' as AccessType);
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      //@ts-ignore
      expect(error.errors).toStrictEqual([{ context: "UserAggregateResolver", message: 'Invalid access type' }]);
    }
  });

  it('should throw a SystemError from findUserFactory', async () => {
    try {
      jest.spyOn(UserAggregateResolverService.prototype, 'resolve')
        .mockImplementation(() => ({
          accessType: 'NO_EXIST' as AccessType,
          parentRepository: undefined
        }) as UserAggregateContext)
      await service.findUserServiceFactory('NO_EXIST' as AccessType);
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      //@ts-ignore
      expect(error.errors).toStrictEqual([{ context: "find User", message: 'fail to create service to find user' }])
    }
  });

});
