import { DeleteUserUsecase } from '@/application/usecases/user-usecases/delete/delete-user-usecase';
import { FindUserUsecase } from '@/application/usecases/user-usecases/find/find-user-usecase';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from '../../../../application/usecases/user-usecases/create-user/create-user-usecase';
import { AccessType } from '../../../../domain/user/access.type';
import { mockCreateUsersDto, mockFindUserDto } from '../../../../../tests/mocks/mock-dtos/mock-dtos';
import { UsersController } from './users.controller';
import { SystemError } from '@/application/services/@shared/system-error';
import { FindAllUserUsecase } from '@/application/usecases/user-usecases/find-all/find-all-user-usecase';
import { FindAllUserDto } from '@/application/services/user/findAll/findAll.user.dto';
import { mockUser } from '../../../../../tests/mocks/domain/user.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;
  let createUserUsecase: { execute: jest.Mock; }
  let deleteUserUsecase: { execute: jest.Mock; }
  let findUserUsecase: { execute: jest.Mock; }
  let findAllUserUsecase: { execute: jest.Mock; }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: DeleteUserUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindUserUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindAllUserUsecase,
          useValue: { execute: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createUserUsecase = module.get(CreateUserUsecase);
    deleteUserUsecase = module.get(DeleteUserUsecase);
    findUserUsecase = module.get(FindUserUsecase);
    findAllUserUsecase = module.get(FindAllUserUsecase);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create User', () => {

    it('should create a new user as admin', async () => {
      const dto = mockCreateUsersDto();
      createUserUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.create(dto)).toBe(void 0);
      expect(createUserUsecase.execute).toHaveBeenCalled();
    });

    it('should create a new user as teacher', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.TEACHER });
      createUserUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.create(dto)).toBe(void 0);
      expect(createUserUsecase.execute).toHaveBeenCalled();
    });

    it('should create a new user as student', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.STUDENT });
      createUserUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.create(dto)).toBe(void 0);
      expect(createUserUsecase.execute).toHaveBeenCalled();
    });

    it('should create a new user as parent', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.PARENT });
      createUserUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.create(dto)).toBe(void 0);
      expect(createUserUsecase.execute).toHaveBeenCalled();
    });

    it('should throw an error when creating a user', async () => {
      const dto = mockCreateUsersDto();
      createUserUsecase.execute.mockRejectedValue(new BadRequestException('Error creating user'))
      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
      expect(createUserUsecase.execute).toHaveBeenCalled();
    });
  });

  describe("Delete user", () => {
    it('should throw an error while deleting an user', async () => {
      deleteUserUsecase.execute.mockRejectedValue(new BadRequestException('User not found.'))
      const wantedId = '123456';
      await expect(controller.delete(wantedId)).rejects
        .toMatchObject(new BadRequestException("User not found."));
      expect(deleteUserUsecase.execute).toHaveBeenCalledTimes(1);
      expect(deleteUserUsecase.execute).toHaveBeenCalledWith(wantedId)
    });

    it('should delete an user', async () => {
      deleteUserUsecase.execute.mockResolvedValue(void 0);
      const wantedId = '7316ebf1-49f9-46ab-adfe-19bfa3737580';
      expect(await controller.delete(wantedId)).toBe(void 0);
      expect(deleteUserUsecase.execute).toHaveBeenCalledTimes(1);
      expect(deleteUserUsecase.execute).toHaveBeenCalledWith(wantedId);
    });
  });

  describe('find user', () => {
    it('should find a user', async () => {
      const dto = mockFindUserDto();
      findUserUsecase.execute.mockResolvedValue(dto);
      const result = await controller.find(dto.id);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(dto.id);
      expect(result.accessType).toStrictEqual(dto.accessType);
      expect(findUserUsecase.execute).toHaveBeenCalledTimes(1);
      expect(findUserUsecase.execute).toHaveBeenCalledWith(dto.id);
    });

    it('should throw an error if user not found', async () => {
      const error = new SystemError([{ context: 'user', message: 'user not found' }], 404);
      findUserUsecase.execute.mockRejectedValue(error);
      await expect(controller.find("123")).rejects.toMatchObject(error);
      expect(findUserUsecase.execute).toHaveBeenCalledTimes(1);
      expect(findUserUsecase.execute).toHaveBeenCalledWith('123');
    });
  });

  describe('findAll', () => {
    it('should return an empty array', async () => {
      const users = new FindAllUserDto([]);
      findAllUserUsecase.execute.mockResolvedValue(users);
      const result = await controller.findAll();
      expect(result).toHaveLength(0);
      expect(findAllUserUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should find users', async () => {
      const user1 = mockUser(AccessType.ADMIN);
      const user2 = mockUser(AccessType.TEACHER);
      const dto = new FindAllUserDto([user1, user2]);
      findAllUserUsecase.execute.mockResolvedValue(dto);
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect([result[0].id, result[1].id].includes(user1.getId())).toBeTruthy();
      expect([result[0].id, result[1].id].includes(user2.getId())).toBeTruthy();
      expect(findAllUserUsecase.execute).toHaveBeenCalledTimes(1);
    })
  });
});
