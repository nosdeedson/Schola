import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { setEnv } from '../../../__mocks__/env.mock';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service';
import { DeleteUserFactoryService } from '../../../factory/delete-user-factory/delete-user-factory.service';
import { UserAggregateResolverService } from '../../../factory/user-aggregate-resolver/user-aggregate-resolver.service';
import { CreateUserFactoryService } from '../../../factory/create-user-service-factory/create-user-factory-service';
import { FindUserFactoryService } from '../../../factory/find-user-factory/find-user-factory.service';
import { mockCreateWorkersDto } from '../../../__mocks__/mock-dtos/mock-dtos';
import { BadRequestException } from '@nestjs/common';
import { UserUsecasesService } from '../../../../application/usecases/user-usecases/user-usecases.service';
import { AccessType } from '../../../../domain/user/access.type';


describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UserUsecasesService,
        CreateUserFactoryService,
        RepositoryFactoryService,
        DeleteUserFactoryService,
        FindUserFactoryService,
        UserAggregateResolverService,
      ],
      imports: [DataBaseConnectionModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user as admin', async () => {
    const dto = mockCreateWorkersDto();
    const userUsecasesService = jest.spyOn(UserUsecasesService.prototype, 'create')
      .mockImplementation(async () => Promise.resolve(void 0));
    await expect(controller.create(dto)).resolves.not.toThrow();
    expect(userUsecasesService).toHaveBeenCalled();
  });

  it('should create a new user as teacher', async () => {
    const dto = mockCreateWorkersDto({accessType: AccessType.TEACHER});
    const userUsecasesService = jest.spyOn(UserUsecasesService.prototype, 'create')
      .mockImplementation(async () => Promise.resolve(void 0));
    await expect(controller.create(dto)).resolves.not.toThrow();
    expect(userUsecasesService).toHaveBeenCalled();
  });

  it('should create a new user as student', async () => {
    const dto = mockCreateWorkersDto({accessType: AccessType.STUDENT});
    const userUsecasesService = jest.spyOn(UserUsecasesService.prototype, 'create')
      .mockImplementation(async () => Promise.resolve(void 0));
    await expect(controller.create(dto)).resolves.not.toThrow();
    expect(userUsecasesService).toHaveBeenCalled();
  });

  it('should create a new user as parent', async () => {
    const dto = mockCreateWorkersDto({accessType: AccessType.PARENT});
    const userUsecasesService = jest.spyOn(UserUsecasesService.prototype, 'create')
      .mockImplementation(async () => Promise.resolve(void 0));
    await expect(controller.create(dto)).resolves.not.toThrow();
    expect(userUsecasesService).toHaveBeenCalled();
  });

  it('should throw an error when creating a user', async () => {
    const dto = mockCreateWorkersDto();
    const userUsecasesService = jest.spyOn(UserUsecasesService.prototype, 'create')
      .mockImplementation(async () => Promise.reject(new BadRequestException("Error creating user")));
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    expect(userUsecasesService).toHaveBeenCalled();
  });

});
