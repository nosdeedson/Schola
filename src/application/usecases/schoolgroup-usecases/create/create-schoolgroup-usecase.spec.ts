import { CreateSchoolgroupUseCase } from "./create-schoolgroup-usecase";
import { BadRequestException } from "@nestjs/common";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { CreateClassService } from "../../../services/class/create/create.class.service";
import { mockCreateSchoolgroupUseCaseDto } from "../../../../../tests/mocks/usecases/create-schoolgroup-usecase-dto.mocks";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateGetWorkerService } from "@/application/services/worker/create-or-get-worker/create-get-worker.service";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";


const mockManager = {
    getRepository: jest.fn().mockReturnValue({
        save: jest.fn()
    })
}

const mockerTransactionService = {
    runInTransaction: jest.fn(async (callback) => await callback(mockManager))
}

describe('CreateSchoolGroupUsecase', () => {

    let service: CreateSchoolgroupUseCase;

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should create a schoolgroup', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();

        const dto = mockCreateSchoolgroupUseCaseDto();

        const teacher = WorkerEntity.toWorkerEntity(mockWorker());
        const input = dto.toCreateClassDto(teacher);

        const createTeacher = jest.spyOn(CreateGetWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(teacher));

        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));

        const usecase = new CreateSchoolgroupUseCase(
            classRepository,
            workerRepository,
        );
        expect(await usecase.create(dto)).toBe(void 0);
        expect(createClass).toHaveBeenCalledTimes(1);
        expect(createClass).toHaveBeenCalledWith(input);
        expect(createTeacher).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while creating the worker', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = mockCreateSchoolgroupUseCaseDto();
        const teacher = WorkerEntity.toWorkerEntity(mockWorker());

        const createTeacher = jest.spyOn(CreateGetWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));
        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));

        const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException('Test') });
        const usecase = new CreateSchoolgroupUseCase(classRepository, workerRepository);
        await expect(usecase.create(dto)).rejects.toMatchObject(new BadRequestException("Test"));
        expect(createClass).toHaveBeenCalledTimes(0);
        expect(createTeacher).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while creating the class', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = mockCreateSchoolgroupUseCaseDto();
        const teacher = WorkerEntity.toWorkerEntity(mockWorker());
        const input = dto.toCreateClassDto(teacher);

        const createTeacher = jest.spyOn(CreateGetWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(teacher));
        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));
        const tratatError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException('Test') });
        const usecase = new CreateSchoolgroupUseCase(classRepository, workerRepository);
        await expect(usecase.create(dto)).rejects.toMatchObject(new BadRequestException("Test"));
        expect(createClass).toHaveBeenCalledTimes(1);
        expect(createClass).toHaveBeenCalledWith(input);
        expect(createTeacher).toHaveBeenCalledTimes(1);
        expect(tratatError).toHaveBeenCalledTimes(1);
    });

});
