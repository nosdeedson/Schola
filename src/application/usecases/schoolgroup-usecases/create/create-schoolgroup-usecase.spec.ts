import { Test, TestingModule } from "@nestjs/testing";
import { DataBaseConnectionModule } from "../../../../infrastructure/data-base-connection/data-base-connection.module";
import { setEnv } from "../../../../infrastructure/__mocks__/env.mock";
import { CreateSchoolgroupUseCase } from "./create-schoolgroup-usecase";
import { RepositoryFactoryService } from "../../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { BadRequestException } from "@nestjs/common";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { CreateClassService } from "../../../services/class/create/create.class.service";
import { CreateWorkerService } from "../../../services/worker/create/create.worker.service";
import { mockCreateSchoolgroupUseCaseDto } from "../../../../../tests/mocks/usecases/create-schoolgroup-usecase-dto.mocks";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

describe('CreateSchoolGroupUsecase', () => {

    let service: CreateSchoolgroupUseCase;
    let module: TestingModule;
    beforeAll(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [CreateSchoolgroupUseCase, RepositoryFactoryService],
        }).compile();

        service = module.get<CreateSchoolgroupUseCase>(CreateSchoolgroupUseCase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a schoolgroup', async () => {
        const dto = mockCreateSchoolgroupUseCaseDto();
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true));
        const input = dto.toCreateClassDto(teacher);
        const createTeacher = jest.spyOn(CreateWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(teacher));
        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve());

        expect(await service.create(dto)).toBe(void 0);
        expect(createClass).toHaveBeenCalledTimes(1);
        expect(createClass).toHaveBeenCalledWith(input);
        expect(createTeacher).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while creating the worker', async () => {
        const dto = mockCreateSchoolgroupUseCaseDto();
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true));
        const input = dto.toCreateClassDto(teacher);

        const createTeacher = jest.spyOn(CreateWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));
        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));

        const tratarError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
                .mockImplementation(() => { throw new BadRequestException('Test') });

        await expect(service.create(dto)).rejects.toMatchObject(new BadRequestException("Test"));
        expect(createClass).toHaveBeenCalledTimes(0);
        expect(createTeacher).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while creating the class', async () => {
        const dto = mockCreateSchoolgroupUseCaseDto();
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true));
        const input = dto.toCreateClassDto(teacher);

        const createTeacher = jest.spyOn(CreateWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(teacher));
        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));
        const tratatError = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => {throw new BadRequestException('Test')});

        await expect(service.create(dto)).rejects.toMatchObject(new BadRequestException("Test"));
        expect(createClass).toHaveBeenCalledTimes(1);
        expect(createClass).toHaveBeenCalledWith(input);
        expect(createTeacher).toHaveBeenCalledTimes(1);
        expect(tratatError).toHaveBeenCalledTimes(1);
    });

})