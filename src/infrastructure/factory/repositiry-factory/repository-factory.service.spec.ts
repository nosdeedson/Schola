import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseConnectionModule } from '../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { TypeRepository } from './type-repository';
import { AcademicSemesterRepository } from '../../repositories/academic-semester/academic-semester.repository';
import { ClassRepository } from '../../repositories/class/class.repository';
import { CommentRepository } from '../../repositories/comment/comment.respository';
import { ParentRepository } from '../../repositories/parent/parent.repository';
import { RatingRepository } from '../../repositories/rating/rating.repository';
import { StudentRepository } from '../../repositories/student/student.repository';
import { UserRepository } from '../../repositories/user/user.repository';
import { WorkerRepository } from '../../repositories/worker/worker.repository';
import { SystemError } from '../../../application/services/@shared/system-error';
import { RepositoryFactoryService } from './repository-factory.service';



describe('RepositiryFactoryService', () => {
  let service: RepositoryFactoryService
    ;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv()
    module = await Test.createTestingModule({
      providers: [RepositoryFactoryService],
      imports: [DataBaseConnectionModule]
    }).compile();

    service = module.get<RepositoryFactoryService>(RepositoryFactoryService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a AcademicSemesterRepository', () => {
    const repository = service.createRepository(TypeRepository.ACADEMIC_SEMESTER);
    expect(repository).toBeInstanceOf(AcademicSemesterRepository)
  });

  it('should create a ClassRepository', () => {
    const repository = service.createRepository(TypeRepository.CLASS);
    expect(repository).toBeInstanceOf(ClassRepository)
  });

  it('should create a CommentRepository', () => {
    const repository = service.createRepository(TypeRepository.COMMENT);
    expect(repository).toBeInstanceOf(CommentRepository)
  });

  it('should create a ParentRepository', () => {
    const repository = service.createRepository(TypeRepository.PARENT);
    expect(repository).toBeInstanceOf(ParentRepository)
  });

  it('should create a RatingRepositiry', () => {
    const repository = service.createRepository(TypeRepository.RATING);
    expect(repository).toBeInstanceOf(RatingRepository)
  });

  it('should create a StudentRepository', () => {
    const repository = service.createRepository(TypeRepository.STUDENT);
    expect(repository).toBeInstanceOf(StudentRepository)
  });

  it('should create a UserRepository', () => {
    const repository = service.createRepository(TypeRepository.USER);
    expect(repository).toBeInstanceOf(UserRepository)
  });

  it('should create a WorkerRepository', () => {
    const repository = service.createRepository(TypeRepository.WORKER);
    expect(repository).toBeInstanceOf(WorkerRepository)
  });

  it('should throw an SystemError', () => {
    try {
      service.createRepository('NO_EXIST' as TypeRepository);
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      //@ts-ignore
      expect(error.errors[0]).toHaveProperty('context', 'RepositoryFactory');
      //@ts-ignore
      expect(error.errors[0]).toHaveProperty('message', 'Erro while creating repository.');
    }
  });

});
