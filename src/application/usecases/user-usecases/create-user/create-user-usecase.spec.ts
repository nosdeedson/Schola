import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserUsecase } from './create-user-usecase';
import { setEnv } from "../../../../infrastructure/__mocks__/env.mock";
import { DataBaseConnectionModule } from "../../../../infrastructure/data-base-connection/data-base-connection.module";
import { RepositoryFactoryService } from "../../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { CreateUserFactoryService } from "../../../../infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { mockCreateUsersDto } from "../../../../infrastructure/__mocks__/mock-dtos/mock-dtos";
import { CreateWorkerDto } from "../../../services/worker/create/create.worker.dto";
import { CreateStudentDto } from "../../../services/student/create/create.student.dto";
import { CreateUserService } from "../../../services/user/create/create.user.service";
import { SystemError } from "../../../services/@shared/system-error";
import { TrataErros } from "../../../../infrastructure/utils/trata-erros/trata-erros";
import { BadRequestException } from "@nestjs/common";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AccessType } from "../../../../domain/user/access.type";

const userServiceFactoryMock = {
    createUserServiceFactory: jest.fn(),
};

// create user mocks
// my return from the factory
const createPersonServiceMock = {
    execute: jest.fn(),
};


describe('CreateUserUsecase', () => {

    let service: CreateUserUsecase;
    let module: TestingModule;

    beforeAll(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [
                CreateUserUsecase,
                RepositoryFactoryService,
                {
                    provide: CreateUserFactoryService,
                    useValue: userServiceFactoryMock
                },
            ],
        }).compile();

        service = module.get<CreateUserUsecase>(CreateUserUsecase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        module.close();
    })

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });


    it('should create a user as a TEACHER', async () => {
        const person = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto(mockInput);
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createUserService = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        await service.create(mockInput);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
        expect(createUserService).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when creating worker', async () => {
        const mockInput = mockCreateUsersDto();
        var errorToThrow = new SystemError([{
            "context": "worker",
            "message": "error while creating worker",
        }]);
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockRejectedValue(errorToThrow);
        
        const createUser = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementation(async () => await Promise.resolve(void 0));

        const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException('error while creating worker') });

        await expect(service.create(mockInput)).rejects.toMatchObject(new BadRequestException('error while creating worker'));
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledTimes(0);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
    });

    it('should throw an error when creating user', async () => {
        const person = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto(mockInput);
        var errorToThrow = new SystemError([{
            "context": "user",
            "message": "error while creating user",
        }]);

        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);

        const createUser = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockRejectedValue(errorToThrow);

        const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementationOnce(() => { throw new BadRequestException('test') });

        await expect(service.create(mockInput)).rejects.toMatchObject(new BadRequestException('test'));
            expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
            expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
            expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
            expect(createUser).toHaveBeenCalledTimes(1);
            expect(tratarError).toHaveBeenCalledTimes(1);
            expect(tratarError).toHaveBeenCalledWith(errorToThrow);
    });

    it('should create a user as a Admin', async () => {
        const person = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.ADMINISTRATOR));
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto(mockInput);
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createUserService = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        await service.create(mockInput);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
        expect(createUserService).toHaveBeenCalledTimes(1);
    });

    it('should create a user as student', async () => {
        const person = StudentEntity.toStudentEntity(DomainMocks.mockStudent());
        const mockInput = mockCreateUsersDto({
            accessType: AccessType.STUDENT,
            email: 'student@email',
            nickname: 'student',
            name: 'edson'
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createStudent = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        await service.create(mockInput);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createStudent).toHaveBeenCalledTimes(1);        
    });

    it('should create a user as parent', async () => {
        const person = StudentEntity.toStudentEntity(DomainMocks.mockStudent());
        const mockInput = mockCreateUsersDto({
            accessType: AccessType.PARENT,
            email: 'parent@email',
            nickname: 'parent',
            name: 'edson'
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createStudent = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        await service.create(mockInput);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createStudent).toHaveBeenCalledTimes(1);        
    });

});