import { AccessType } from '@/domain/user/access.type';
import { CreateUserRequestDto } from './create-user-request-dto'
import { mockCreateUserRequestDto } from '../../../../../../../tests/mocks/controller/create-user-request-dto-mock';
describe('CreateWorkersDto', () => {
  it('should be defined', () => {
    expect(new CreateUserRequestDto()).toBeDefined();
  });

  it('should create a dto as admin user', () => {
    const dto = mockCreateUserRequestDto({accessType: AccessType.ADMIN});
    expect(dto.accessType).toBe(AccessType.ADMIN);
  });

  it('should create a dto as admin teacher', () => {
    const dto = mockCreateUserRequestDto({accessType: AccessType.TEACHER});
    expect(dto).toBeDefined();
    expect(dto.accessType).toBe(AccessType.TEACHER);
  });

  it('should create a dto as admin parent', () => {
    const dto = mockCreateUserRequestDto({accessType: AccessType.PARENT});
    dto.students = ['student 1']
    expect(dto).toBeDefined();
    expect(dto.accessType).toBe(AccessType.PARENT);
  });

  it('should create a dto as admin student', () => {
    const dto = mockCreateUserRequestDto({accessType: AccessType.STUDENT});
    dto.parents = ['parent 1'];
    expect(dto).toBeDefined();
    expect(dto.accessType).toBe(AccessType.STUDENT);
  });
});
