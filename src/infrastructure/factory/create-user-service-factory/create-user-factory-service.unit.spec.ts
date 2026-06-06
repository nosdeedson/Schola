import { CreateUserFactoryService } from './create-user-factory-service';
import { AccessType } from '../../../domain/user/access.type';
import { UserAggregateResolverService } from '../user-aggregate-resolver/user-aggregate-resolver.service';
import { SystemError } from '../../../application/services/@shared/system-error';
import { CreateWorkerService } from '../../../application/services/worker/create/create.worker.service';
import { CreateParentStudentService } from '../../../application/services/parent-student/create/create.parent.student.service';
import { StudentRepository } from '@/infrastructure/repositories/student/student.repository';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { ParentRepository } from '@/infrastructure/repositories/parent/parent.repository';
import { WorkerRepository } from '@/infrastructure/repositories/worker/worker.repository';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';


describe('UserServiceFactoryService', () => {
  let service: CreateUserFactoryService;
  let userAggregateResolverService: jest.Mocked<UserAggregateResolverService>;
  beforeAll(async () => {
    userAggregateResolverService = {
      resolve: jest.fn()
    } as any
    service = new CreateUserFactoryService(userAggregateResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when accessType equal to teacher must return a CreateWorkerSevice', () => {
    userAggregateResolverService.resolve.mockReturnValue({
      accessType: AccessType.TEACHER,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository,
    });
    const result = service.createUserServiceFactory(AccessType.TEACHER);
    expect(result).toBeInstanceOf(CreateWorkerService);
  });

  it('when accessType equal to admin must return a CreateWorkerSevice', () => {
    userAggregateResolverService.resolve.mockReturnValue({
      accessType: AccessType.TEACHER,
      workerRepository: {} as WorkerRepository,
      classRepository: {} as ClassRepository,
    });
    const result = service.createUserServiceFactory(AccessType.ADMIN);
    expect(result).toBeInstanceOf(CreateWorkerService);
  });

  it('when accessType equal to student must return a CreateParentStudentService', () => {
    userAggregateResolverService.resolve.mockReturnValue({
      accessType: AccessType.STUDENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository
    });
    const result = service.createUserServiceFactory(AccessType.STUDENT);
    expect(result).toBeInstanceOf(CreateParentStudentService);
  });

  it('when accessType equal to teacher must return a CreateParentStudentService', () => {
    userAggregateResolverService.resolve.mockReturnValue({
      accessType: AccessType.STUDENT,
      studentRepository: {} as StudentRepository,
      classRepository: {} as ClassRepository,
      parentRepository: {} as ParentRepository,
      parentStudentRepository: {} as ParentStudentRepository
    });
    const result = service.createUserServiceFactory(AccessType.PARENT);
    expect(result).toBeInstanceOf(CreateParentStudentService);
  });

  it('should throw an error when accessType does not exist', async () => {
    const error = new SystemError([{ context: 'UserAggregateResolver', message: 'Invalid access type' },], 400);
    userAggregateResolverService.resolve.mockImplementation(() => { throw error });
    expect(() => service.createUserServiceFactory('NO_EXIST' as AccessType))
      .toThrow(SystemError)
  });
});
