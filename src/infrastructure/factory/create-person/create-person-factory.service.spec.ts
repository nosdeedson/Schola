import { Test, TestingModule } from '@nestjs/testing';
import { CreatePersonFactoryService } from './create-person-factory.service';
import { AccessType } from '../../../domain/user/access.type';
import { CreateWorkerDto } from '../../../application/services/worker/create/create.worker.dto';
import { CreateStudentDto } from '../../../application/services/student/create/create.student.dto';
import { CreateParentDto } from '../../../application/services/parent/create/create.parent.dto';
import { SystemError } from '../../../application/services/@shared/system-error';
import { mockCreateUserRequestDto } from '../../../../tests/mocks/controller/create-user-request-dto-mock';

describe('CreatePersonService', () => {
  let service: CreatePersonFactoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePersonFactoryService],
    }).compile();

    service = module.get<CreatePersonFactoryService>(CreatePersonFactoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a dto for a teacher', () => {
    const dto = mockCreateUserRequestDto({ accessType: AccessType.TEACHER });
    const result = CreatePersonFactoryService.createDTOPersonFactory(dto);
    expect(result).toBeInstanceOf(CreateWorkerDto)
  });

  it('should create a dto for an admin', () => {
    const dto = mockCreateUserRequestDto({ accessType: AccessType.ADMIN });
    const result = CreatePersonFactoryService.createDTOPersonFactory(dto);
    expect(result).toBeInstanceOf(CreateWorkerDto)
  });

  it('should create a dto for a student', () => {
    const dto = mockCreateUserRequestDto({ accessType: AccessType.STUDENT });
    const result = CreatePersonFactoryService.createDTOPersonFactory(dto);
    expect(result).toBeInstanceOf(CreateStudentDto)
  });

  it('should create a dto for a parent', () => {
    const dto = mockCreateUserRequestDto({ accessType: AccessType.PARENT });
    const result = CreatePersonFactoryService.createDTOPersonFactory(dto);
    expect(result).toBeInstanceOf(CreateParentDto)
  });

  it('should throw an error', async () => {
    const dto = mockCreateUserRequestDto({ accessType: AccessType.STUDENT });
    dto.accessType = 'invalid' as AccessType;
    try {
      CreatePersonFactoryService.createDTOPersonFactory(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      //@ts-ignore
      expect(error.errors).toStrictEqual([{ context: 'CreatePersonFactoryService', message: 'Invalid access type' }]);
    }
  })
});
