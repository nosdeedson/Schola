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

describe('DeleteUserFactoryService', () => {
  let service: DeleteUserFactoryService;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      providers: [
      DeleteUserFactoryService,
      UserAggregateResolverService,
      RepositoryFactoryService,
    ],
      imports: [DataBaseConnectionModule]
    }).compile();

    service = module.get<DeleteUserFactoryService>(DeleteUserFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a DeleteParentService instance', () => {
    const deleteParentService = service.deleteUserServiceFactory(AccessType.PARENT);
    expect(deleteParentService).toBeInstanceOf(DeleteParentService);
  });

  it('shoult return a DeleteStudent instance', () => {
    const deleteStudentService = service.deleteUserServiceFactory(AccessType.STUDENT);
    expect(deleteStudentService).toBeInstanceOf(DeleteStudentService);
  });

  it('should return a DeleteWorkerService instance of worker', () => {
    const deleteWorkerService = service.deleteUserServiceFactory(AccessType.TEACHER);
    expect(deleteWorkerService).toBeInstanceOf(DeleteWorkerService);
  });

  it('should return a DeleteWorkerService instance of admin', () => {
    const deleteWorkerService = service.deleteUserServiceFactory(AccessType.ADMIN);
    expect(deleteWorkerService).toBeInstanceOf(DeleteWorkerService);
  });

});
