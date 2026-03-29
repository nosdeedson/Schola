import { UserUsecasesService } from "./user-usecases.service"
import { Test, TestingModule } from "@nestjs/testing";
import { setEnv } from "../../../infrastructure/__mocks__/env.mock";
import { DataBaseConnectionModule } from "../../../infrastructure/data-base-connection/data-base-connection.module";
import { RepositoryFactoryService } from "../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { CreateUserFactoryService } from "../../../infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { DeleteUserFactoryService } from "../../../infrastructure/factory/delete-user-factory/delete-user-factory.service";
import { FindUserFactoryService } from "../../../infrastructure/factory/find-user-factory/find-user-factory.service";
import { DomainMocks } from "../../../infrastructure/__mocks__/mocks";
import { RoleEnum } from "../../../domain/worker/roleEnum";
import { WorkerEntity } from "../../../infrastructure/entities/worker/worker.entity";
import { CreateUserService } from "../../services/user/create/create.user.service";
import { DeleteUserService } from "../../services/user/delete/delete.user.service";
import { FindUserService } from "../../services/user/find/find.user.service";
import { mockCreateWorkersDto, mockFindUserDto, mockOutputFindWorkerDto } from "../../../infrastructure/__mocks__/mock-dtos/mock-dtos";
import { CreateWorkerDto } from "../../services/worker/create/create.worker.dto";
import { BadRequestException } from "@nestjs/common";
import { SystemError } from "../../services/@shared/system-error";
import { TrataErros } from "../../../infrastructure/utils/trata-erros/trata-erros";
import { FindUserOutPutDto } from "../../../infrastructure/api/controllers/users/dtos/find-user-dto/find-user-outPut-dto";


const userServiceFactoryMock = {
  createUserServiceFactory: jest.fn(),
};

// delete user mocks 
// return this from factory
const deletePersonServiceMock = {
  execute: jest.fn(),
};

const userServiceDeleteFactory = {
  deleteUserServiceFactory: jest.fn(),
};

// this will be returned by the userServiceFindFactory
const findPersonServiceMock = {
  execute: jest.fn(),
}

const userServiceFindFactory = {
  findUserServiceFactory: jest.fn(),
};

describe('UserUsecasesService', () => {
  let service: UserUsecasesService;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DataBaseConnectionModule],
      providers: [
        UserUsecasesService,
        RepositoryFactoryService,
        {
          provide: CreateUserFactoryService,
          useValue: userServiceFactoryMock
        },
        {
          provide: DeleteUserFactoryService,
          useValue: userServiceDeleteFactory,
        },
        {
          provide: FindUserFactoryService,
          useValue: userServiceFindFactory,
        }
      ],
    }).compile();

    service = module.get<UserUsecasesService>(UserUsecasesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  describe('delele', () => {

    it('should delete a user', async () => {
      let foundUser = mockFindUserDto();
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      userServiceDeleteFactory.deleteUserServiceFactory.mockReturnValue(deletePersonServiceMock as any);
      deletePersonServiceMock.execute.mockReturnValue(async () => await Promise.resolve(void 0));

      const deleteUser = jest.spyOn(DeleteUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(void 0));
      expect(await service.delete(foundUser.id)).toBe(void 0);
      expect(findUserService).toHaveBeenCalledTimes(1);
      expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledTimes(1);
      expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledWith(foundUser.accessType);
      expect(deletePersonServiceMock.execute).toHaveBeenCalledTimes(1);
      expect(deletePersonServiceMock.execute).toHaveBeenCalledWith(foundUser.personId);
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledWith(foundUser.id);
    });

    it('should not find a user to delete', async () => {
      let expectedId = "1";
      const errorToThrow = new SystemError([{
        "context": "user",
        "message": "user not found",
      }]);
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.reject(errorToThrow));
      userServiceDeleteFactory.deleteUserServiceFactory.mockReturnValue(deletePersonServiceMock as any);
      deletePersonServiceMock.execute.mockReturnValue(async () => await Promise.resolve(void 0));
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });
      try {
        await service.delete(expectedId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(expectedId);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledTimes(0);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledTimes(0);
      }
    });

    it('should not create a service to delete', async () => {
      let foundUser = mockFindUserDto();
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      const errorToThrow = new SystemError([{
        "context": "delete user",
        "message": "fail to create service to delete",
      }]);
      userServiceDeleteFactory.deleteUserServiceFactory.mockRejectedValue(errorToThrow);
      deletePersonServiceMock.execute.mockReturnValue(async () => await Promise.resolve(void 0));
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });
      try {
        await service.delete(foundUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(foundUser.id);
        expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledTimes(0);
      }
    });

    it('should not delete a person', async () => {
      let foundUser = mockFindUserDto();
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      const errorToThrow = new SystemError([{
        "context": "delete user",
        "message": "fail to create service to delete",
      }]);
      userServiceDeleteFactory.deleteUserServiceFactory.mockReturnValue(deletePersonServiceMock as any);
      deletePersonServiceMock.execute.mockRejectedValue(errorToThrow);

      const deleteUser = jest.spyOn(DeleteUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(void 0));
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });
      try {
        await service.delete(foundUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(foundUser.id);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledWith(foundUser.personId);
        expect(deleteUser).toHaveBeenCalledTimes(0);
      }
    });

    it('should not delete an user', async () => {
      let foundUser = mockFindUserDto();
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      const errorToThrow = new SystemError([{
        "context": "delete user",
        "message": "fail to create service to delete",
      }]);
      userServiceDeleteFactory.deleteUserServiceFactory.mockReturnValue(deletePersonServiceMock as any);
      deletePersonServiceMock.execute.mockImplementation(async () => await Promise.resolve(void 0));

      const deleteUser = jest.spyOn(DeleteUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.reject(errorToThrow));
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });
      try {
        await service.delete(foundUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(foundUser.id);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(userServiceDeleteFactory.deleteUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(deletePersonServiceMock.execute).toHaveBeenCalledWith(foundUser.personId);
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(deleteUser).toHaveBeenCalledWith(foundUser.id);
      }
    });

  });

  describe('find', () => {

    it('should find a user which role is teacher', async () => {
      const foundUser = mockFindUserDto();
      const wantedId = foundUser.id;
      const person = mockOutputFindWorkerDto();
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));

      userServiceFindFactory.findUserServiceFactory.mockReturnValue(findPersonServiceMock);
      findPersonServiceMock.execute.mockReturnValue(async () => await Promise.resolve(person));

      const result = await service.find(wantedId);
      expect(result).toBeInstanceOf(FindUserOutPutDto);
      expect(result).toHaveProperty('role', RoleEnum.TEACHER);
      expect(findUserService).toHaveBeenCalledTimes(1)
      expect(findUserService).toHaveBeenCalledWith(wantedId);
      expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledTimes(1);
      expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledWith(foundUser.accessType);
      expect(findPersonServiceMock.execute).toHaveBeenCalledTimes(1);
      expect(findPersonServiceMock.execute).toHaveBeenCalledWith(foundUser.personId);
    });

    it('when trying to find a user should fail', async () => {
      const person = mockOutputFindWorkerDto();
      const errorToThrow = new SystemError([{ context: 'user', message: 'user not found' }]);
      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.reject(errorToThrow));

      userServiceFindFactory.findUserServiceFactory.mockReturnValue(findPersonServiceMock);
      findPersonServiceMock.execute.mockReturnValue(async () => await Promise.resolve(person));
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });

      try {
        await service.find('1');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledTimes(0);
        expect(findPersonServiceMock.execute).toHaveBeenCalledTimes(0);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
      }
    });

    it('when trying to create the find service should fail', async () => {
      const foundUser = mockFindUserDto();
      const wantedId = foundUser.id;
      const person = mockOutputFindWorkerDto();
      const errorToThrow = new SystemError([{ context: 'UserAggregateResolver', message: 'Invalid access type' },]);

      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      userServiceFindFactory.findUserServiceFactory.mockRejectedValue(errorToThrow);
      findPersonServiceMock.execute.mockImplementation(async () => await Promise.resolve(person));

      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });

      try {
        await service.find(wantedId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1)
        expect(findUserService).toHaveBeenCalledWith(wantedId);
        expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(findPersonServiceMock.execute).toHaveBeenCalledTimes(0);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
      }
    });

    it('when trying to find a person as teacher should fail', async () => {
      const foundUser = mockFindUserDto();
      const wantedId = foundUser.id;
      const person = mockOutputFindWorkerDto();
      const errorToThrow = new SystemError([{ context: "find user", message: "Failed to find the user" }]);

      const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
        .mockImplementation(async () => await Promise.resolve(foundUser));
      userServiceFactoryMock.createUserServiceFactory.mockReturnValue(findPersonServiceMock);
      findPersonServiceMock.execute.mockRejectedValue(errorToThrow);
      const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
        .mockImplementation(() => { throw new BadRequestException('test') });
      try {

      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(findUserService).toHaveBeenCalledTimes(1)
        expect(findUserService).toHaveBeenCalledWith(wantedId);
        expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(userServiceFindFactory.findUserServiceFactory).toHaveBeenCalledWith(foundUser.accessType);
        expect(findPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(findPersonServiceMock.execute).toHaveBeenCalledWith(foundUser.personId);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
      }

    });

  });

   describe('findAll', () => {
    // TODO FIX THE TEST
    // it('should find all users', async () => {
    //   const worker = UserEntity.toUserEntity(DomainMocks.mockUserTeacher());
    //   const admin = UserEntity.toUserEntity(DomainMocks.mockUserAdmin());
    //   const all = new FindAllUserDto([worker, admin]);
    //   const findAll = jest.spyOn(FindAllUserService.prototype, 'execute')
    //     .mockImplementation(async () => await Promise.resolve(all));
    //   const findPerson = jest.spyOn(WorkerRepository.prototype, 'find')
    //     .mockImplementation(async () => await Promise.resolve(worker));
    //   const result = await service.findAll();
    //   expect(result).toBeInstanceOf(Array);
    //   expect(result.length).toBe(2);
    //   expect(result[0]).toBeInstanceOf(FindUserOutPutDto);
    //   expect(result[1]).toBeInstanceOf(FindUserOutPutDto);
    //   expect(findAll).toHaveBeenCalledTimes(1);
    //   expect(findPerson).toHaveBeenCalledTimes(2);
    // });
  })

});