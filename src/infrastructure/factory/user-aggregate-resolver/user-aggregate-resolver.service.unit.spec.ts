import { Test, TestingModule } from '@nestjs/testing';
import { ParentStudentAggregateContext, UserAggregateResolverService } from './user-aggregate-resolver.service';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { DataBaseConnectionModule } from '../../data-base-connection/data-base-connection.module';
import { AccessType } from '../../../domain/user/access.type';
import { ParentRepository } from '../../../infrastructure/repositories/parent/parent.repository';
import { StudentRepository } from '../../../infrastructure/repositories/student/student.repository';
import { WorkerRepository } from '../../../infrastructure/repositories/worker/worker.repository';
import { WorkerAggregateContext } from './user-aggregate-resolver.service';
import { RepositoryFactoryService } from '../repositiry-factory/repository-factory.service';
import { TestDataSource } from '@/infrastructure/repositories/config-test/test.datasource';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { ParentStudentRepository } from '@/infrastructure/repositories/parent-student/parent.student.repositoy';

describe('UserAggregateResolverService', () => {
  let service: UserAggregateResolverService;
  let repositoryFactoryService: jest.Mocked<RepositoryFactoryService>;
  let module: TestingModule;

  beforeEach(async () => {
    repositoryFactoryService = {
      createRepository: jest.fn()
    } as any;
    service = new UserAggregateResolverService(repositoryFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve TEACHER aggregate context', () => {
    repositoryFactoryService.createRepository
      .mockReturnValueOnce(new WorkerRepository(TestDataSource))
      .mockReturnValueOnce(new ClassRepository(TestDataSource));
    const context = service.resolve(AccessType.TEACHER) as WorkerAggregateContext;
    expect(context).toBeDefined();
    expect(context.accessType).toBe(AccessType.TEACHER);
    expect(context).toHaveProperty('workerRepository');
    expect(context.workerRepository).toBeInstanceOf(WorkerRepository);
  });

  it('should resolve STUDENT aggregate context', () => {
    repositoryFactoryService.createRepository
      .mockReturnValueOnce(new StudentRepository(TestDataSource))
      .mockReturnValueOnce(new ClassRepository(TestDataSource))
      .mockReturnValueOnce(new ParentRepository(TestDataSource))
      .mockReturnValueOnce(new ParentStudentRepository(TestDataSource));

    const context = service.resolve(AccessType.STUDENT) as ParentStudentAggregateContext;
    expect(context).toBeDefined();
    expect(context.accessType).toBe(AccessType.STUDENT);
    expect(context).toHaveProperty('studentRepository');
    expect(context).toHaveProperty('classRepository');
    expect(context).toHaveProperty('parentRepository');
    expect(context.studentRepository).toBeInstanceOf(StudentRepository);
  });

  it('should resolve ADMIN aggregate context', () => {
    repositoryFactoryService.createRepository
      .mockReturnValueOnce(new WorkerRepository(TestDataSource))
      .mockReturnValueOnce(new ClassRepository(TestDataSource));

    const context = service.resolve(AccessType.ADMIN) as WorkerAggregateContext;
    expect(context).toBeDefined();
    expect(context.accessType).toBe(AccessType.ADMIN);
    expect(context).toHaveProperty('workerRepository');
    expect(context).toHaveProperty('classRepository');
    expect(context).toHaveProperty('workerRepository');
    expect(context.workerRepository).toBeInstanceOf(WorkerRepository);
  });

  it('should resolve PARENT aggregate context', () => {
    repositoryFactoryService.createRepository
      .mockReturnValueOnce(new StudentRepository(TestDataSource))
      .mockReturnValueOnce(new ClassRepository(TestDataSource))
      .mockReturnValueOnce(new ParentRepository(TestDataSource))
      .mockReturnValueOnce(new ParentStudentRepository(TestDataSource));
    const context = service.resolve(AccessType.PARENT) as ParentStudentAggregateContext;
    expect(context).toBeDefined();
    expect(context.accessType).toBe(AccessType.PARENT);
    expect(context).toHaveProperty('parentRepository');
    expect(context.parentRepository).toBeInstanceOf(ParentRepository);
  });

});
