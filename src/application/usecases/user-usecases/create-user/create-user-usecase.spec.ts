import { CreateUserUsecase } from './create-user-usecase';
import { RepositoryFactoryService } from "../../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { CreateUserFactoryService } from "../../../../infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { mockCreateUsersDto } from "../../../../../tests/mocks/mock-dtos/mock-dtos";
import { CreateWorkerDto } from "../../../services/worker/create/create.worker.dto";
import { CreateUserService } from "../../../services/user/create/create.user.service";
import { SystemError } from "../../../services/@shared/system-error";
import { ExceptionHandler } from "../../../../infrastructure/utils/exception-handler/exception-handler";
import { BadRequestException } from "@nestjs/common";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AccessType } from "../../../../domain/user/access.type";
import { WorkerValidation } from "@/domain/service/worker-validation";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';

const userServiceFactoryMock = {
    createUserServiceFactory: jest.fn(),
};

// create user mocks
// my return from the factory
const createPersonServiceMock = {
    execute: jest.fn(),
};

const repositoryFactoryMock = {
    createRepository: jest.fn(),
}


describe('CreateUserUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should create a user as a TEACHER', async () => {
        const person = WorkerEntity.toWorkerEntity(mockWorker());
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto({
            classCode: mockInput.classCode,
            name: mockInput.name,
            accessType: mockInput.accessType,
            birthday: new Date(mockInput.birthDate)
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createUserService = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0))
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        expect(await useCase.execute(mockInput)).toBe(void 0);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
        expect(createUserService).toHaveBeenCalledTimes(1);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when creating worker', async () => {
        const mockInput = mockCreateUsersDto();
        var errorToThrow = new SystemError([{
            "context": "worker",
            "message": "error while creating worker",
        }], 422);
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockRejectedValue(errorToThrow);

        const createUser = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementation(async () => await Promise.resolve(void 0));

        const tratarError = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException('error while creating worker') });
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0));
        await expect(useCase.execute(mockInput)).rejects.toMatchObject(new BadRequestException('error while creating worker'));
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledTimes(0);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when creating user', async () => {
        const person = WorkerEntity.toWorkerEntity(mockWorker());
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto({
            classCode: mockInput.classCode,
            name: mockInput.name,
            accessType: mockInput.accessType,
            birthday: new Date(mockInput.birthDate)
        });
        var errorToThrow = new SystemError([{
            "context": "user",
            "message": "error while creating user",
        }], 422);

        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);

        const createUser = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockRejectedValue(errorToThrow);

        const tratarError = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementationOnce(() => { throw new BadRequestException('test') });
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0))
        await expect(useCase.execute(mockInput)).rejects.toMatchObject(new BadRequestException('test'));
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledWith(errorToThrow);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should create a user as a Admin', async () => {
        const person = WorkerEntity.toWorkerEntity(mockWorker({ role: RoleEnum.ADMINISTRATOR }));
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto({
            classCode: mockInput.classCode,
            name: mockInput.name,
            accessType: mockInput.accessType,
            birthday: new Date(mockInput.birthDate)
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        createPersonServiceMock.execute.mockResolvedValue(person);
        const createUserService = jest.spyOn(CreateUserService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0))
        expect(await useCase.execute(mockInput)).toBe(void 0);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createPersonServiceMock.execute).toHaveBeenCalledWith(input);
        expect(createUserService).toHaveBeenCalledTimes(1);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should create a user as student', async () => {
        const person = StudentEntity.toStudentEntity(mockStudent());
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
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0))
        expect(await useCase.execute(mockInput)).toBe(void 0);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createStudent).toHaveBeenCalledTimes(1);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should create a user as parent', async () => {
        const person = StudentEntity.toStudentEntity(mockStudent());
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
        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => Promise.resolve(void 0))
        expect(await useCase.execute(mockInput)).toBe(void 0);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(1);
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledWith(mockInput.accessType);
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(1);
        expect(createStudent).toHaveBeenCalledTimes(1);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

    it('should throw a badrequest (class  not found) while creating user as a TEACHER', async () => {
        const person = WorkerEntity.toWorkerEntity(mockWorker());
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto({
            classCode: mockInput.classCode,
            name: mockInput.name,
            accessType: mockInput.accessType,
            birthday: new Date(mockInput.birthDate)
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => { throw new SystemError([{ context: 'user', message: 'class not found' }], 404); })
        const tratarErro = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException('class not found') })

        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        await expect(useCase.execute(mockInput)).rejects
            .toMatchObject(new BadRequestException('class not found'))
        expect(tratarErro).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(0)
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(0);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });


    it('should throw a badrequest (teacher does not teach the class) while creating user as a TEACHER', async () => {
        const person = WorkerEntity.toWorkerEntity(mockWorker());
        const mockInput = mockCreateUsersDto();
        const input = new CreateWorkerDto({
            classCode: mockInput.classCode,
            name: mockInput.name,
            accessType: mockInput.accessType,
            birthday: new Date(mockInput.birthDate)
        });
        userServiceFactoryMock.createUserServiceFactory.mockReturnValue(createPersonServiceMock as any);
        const workerValidation = jest.spyOn(WorkerValidation.prototype, 'validateWorker')
            .mockImplementation(() => { throw new SystemError([{ context: 'user', message: 'You are not teaching in this class' }], 400); })
        const tratarErro = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException('You are not teaching in this class') })

        const useCase = new CreateUserUsecase(
            userServiceFactoryMock as unknown as CreateUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        await expect(useCase.execute(mockInput)).rejects
            .toMatchObject(new BadRequestException('You are not teaching in this class'))
        expect(tratarErro).toHaveBeenCalledTimes(1)
        expect(userServiceFactoryMock.createUserServiceFactory).toHaveBeenCalledTimes(0)
        expect(createPersonServiceMock.execute).toHaveBeenCalledTimes(0);
        expect(workerValidation).toHaveBeenCalledTimes(1);
    });

});
