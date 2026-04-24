import { DeleteUserUsecase } from '@/application/usecases/user-usecases/delete/delete-user-usecase';
import { FindUserUsecase } from '@/application/usecases/user-usecases/find/find-user-usecase';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from '../../../../application/usecases/user-usecases/create-user/create-user-usecase';
import { AccessType } from '../../../../domain/user/access.type';
import { setEnv } from '../../../__mocks__/env.mock';
import { mockCreateUsersDto, mockFindUserDto } from '../../../__mocks__/mock-dtos/mock-dtos';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { CreateUserFactoryService } from '../../../factory/create-user-service-factory/create-user-factory-service';
import { DeleteUserFactoryService } from '../../../factory/delete-user-factory/delete-user-factory.service';
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service';
import { UserAggregateResolverService } from '../../../factory/user-aggregate-resolver/user-aggregate-resolver.service';
import { IsStrongPasswordConstraint } from '../../validators/is-strong-password-constraint/is-strong-password-constraint';
import { userDeleteUsecaseProvider } from './providers/user-delete-usecase-providers';
import { userProviders } from './providers/user-provider';
import { UsersController } from './users.controller';
import { SystemError } from '@/application/services/@shared/system-error';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ...userProviders,
        ...userDeleteUsecaseProvider,
        IsStrongPasswordConstraint,
        RepositoryFactoryService,
        CreateUserFactoryService,
        DeleteUserFactoryService,
        UserAggregateResolverService,
      ],
      imports: [DataBaseConnectionModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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
      const userUsecasesService = jest.spyOn(CreateUserUsecase.prototype, 'execute')
        .mockImplementation(async () => Promise.resolve(void 0));
      expect(await controller.create(dto)).toBe(void 0);
      expect(userUsecasesService).toHaveBeenCalled();
    });

    it('should create a new user as teacher', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.TEACHER });
      const userUsecasesService = jest.spyOn(CreateUserUsecase.prototype, 'execute')
        .mockImplementation(async () => Promise.resolve(void 0));
      expect(await controller.create(dto)).toBe(void 0);
      expect(userUsecasesService).toHaveBeenCalled();
    });

    it('should create a new user as student', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.STUDENT });
      const userUsecasesService = jest.spyOn(CreateUserUsecase.prototype, 'execute')
        .mockImplementation(async () => Promise.resolve(void 0));
      expect(await controller.create(dto)).toBe(void 0);
      expect(userUsecasesService).toHaveBeenCalled();
    });

    it('should create a new user as parent', async () => {
      const dto = mockCreateUsersDto({ accessType: AccessType.PARENT });
      const userUsecasesService = jest.spyOn(CreateUserUsecase.prototype, 'execute')
        .mockImplementation(async () => Promise.resolve(void 0));
      expect(await controller.create(dto)).toBe(void 0);
      expect(userUsecasesService).toHaveBeenCalled();
    });

    it('should throw an error when creating a user', async () => {
      const dto = mockCreateUsersDto();
      const userUsecasesService = jest.spyOn(CreateUserUsecase.prototype, 'execute')
        .mockImplementation(async () => Promise.reject(new BadRequestException("Error creating user")));
      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
      expect(userUsecasesService).toHaveBeenCalled();
    });
  });

  describe("Delete user", () => {
    it('should throw an error while deleting an user', async () => {
      const deleteUseCase = jest.spyOn(DeleteUserUsecase.prototype, 'execute')
        .mockImplementation(() => {throw new BadRequestException("User not found.")});
      const wantedId = '123456';
      await expect(controller.delete(wantedId)).rejects
        .toMatchObject(new BadRequestException("User not found."));
      expect(deleteUseCase).toHaveBeenCalledTimes(1);
      expect(deleteUseCase).toHaveBeenCalledWith(wantedId)
    });

    it('should delete an user', async () => {
      const deleteUsecase = jest.spyOn(DeleteUserUsecase.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(void 0));
      const wantedId = '7316ebf1-49f9-46ab-adfe-19bfa3737580';
      expect(await controller.delete(wantedId)).toBe(void 0);
      expect(deleteUsecase).toHaveBeenCalledTimes(1);
      expect(deleteUsecase).toHaveBeenCalledWith(wantedId);
    });
  });

  describe('find user', () => {
    it('should find a user', async () => {
      const dto = mockFindUserDto();
      const usecase = jest.spyOn(FindUserUsecase.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(dto));
      const result = await controller.find(dto.id);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(dto.id);
      expect(result.accessType).toStrictEqual(dto.accessType);
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith(dto.id);
    });

    it('should throw an error if user not found', async () => {
      const error = new SystemError([{ context: 'user', message: 'user not found' }]);
      const usecase = jest.spyOn(FindUserUsecase.prototype, 'execute')
        .mockImplementation(() => {throw error});
      await expect(controller.find("123")).rejects.toMatchObject(error);
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith('123');
    });
  });
});
