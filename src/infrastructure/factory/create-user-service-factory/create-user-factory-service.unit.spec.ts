import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserFactoryService } from './create-user-factory-service';
import { DataBaseConnectionModule } from '../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { AccessType } from '../../../domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { SystemError } from '../../../application/services/@shared/system-error';
import { RepositoryFactoryService } from '../repositiry-factory/repository-factory.service';
import { CreateWorkerService } from '../../../application/services/worker/create/create.worker.service';
import { CreateParentStudentService  } from '../../../application/services/parent-student/create/create.parent.student.service';


describe('UserServiceFactoryService', () => {
  let service: CreateUserFactoryService;
  let module: TestingModule;
  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      providers: [
        CreateUserFactoryService,
        UserAggregateResolverService,
        RepositoryFactoryService,
      ],
      imports: [DataBaseConnectionModule],
    }).compile();

    service = module.get<CreateUserFactoryService>(CreateUserFactoryService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when accessType equal to teacher must return a CreateWorkerSevice', () => {
    const result = service.createUserServiceFactory(AccessType.TEACHER);
    expect(result).toBeInstanceOf(CreateWorkerService);
  });

  it('when accessType equal to admin must return a CreateWorkerSevice', () => {
    const result = service.createUserServiceFactory(AccessType.ADMIN);
    expect(result).toBeInstanceOf(CreateWorkerService);
  });

  it('when accessType equal to student must return a CreateParentStudentService', () => {
    const result = service.createUserServiceFactory(AccessType.STUDENT);
    expect(result).toBeInstanceOf(CreateParentStudentService);
  });

  it('when accessType equal to teacher must return a CreateParentStudentService', () => {
    const result = service.createUserServiceFactory(AccessType.PARENT);
    expect(result).toBeInstanceOf(CreateParentStudentService);
  });

  it('should throw an error when accessType does not exist', () => {
    try {
      service.createUserServiceFactory('NO_EXIST' as AccessType);
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      //@ts-ignore
      expect(error.errors).toStrictEqual([{ context: 'UserAggregateResolver', message: 'Invalid access type' }]);
    }
  });


});
