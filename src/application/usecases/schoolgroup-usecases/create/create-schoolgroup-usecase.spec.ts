import { Test, TestingModule } from "@nestjs/testing";
import { DataBaseConnectionModule } from "../../../../infrastructure/data-base-connection/data-base-connection.module";
import { setEnv } from "../../../../infrastructure/__mocks__/env.mock";
import { CreateSchoolgroupUseCase } from "./schoolgroup";
import { RepositoryFactoryService } from "../../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { BadRequestException } from "@nestjs/common";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { MockSchoolgroupDto } from "../../../../infrastructure/__mocks__/mock-schoolgroup-dto";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { CreateSchoolgroupDto } from "../../../../infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-dto";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { CreateClassService } from "../../../services/class/create/create.class.service";
import { CreateWorkerService } from "../../../services/worker/create/create.worker.service";

describe('CreateSchoolGroupUsecase', () => {

    let service: CreateSchoolgroupUseCase;
    let module: TestingModule;
    let input: any;
    beforeEach(async () => {
        input = {
            classCode: undefined,
            nameBook: "book name",
            name: "teste",
            scheduleDto: {
                dayOfWeeks: [
                    "Monday",
                    "Tuesday",
                ],
                times: { 'Monday': '08:00', 'Tuesday': '09:00' },
            },
        };
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [CreateSchoolgroupUseCase, RepositoryFactoryService],
        }).compile();

        service = module.get<CreateSchoolgroupUseCase>(CreateSchoolgroupUseCase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a schoolgroup', async () => {
        let dto = MockSchoolgroupDto.dtoToCreate();

        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve());
        const createTeacher = jest.spyOn(CreateWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true))));

        const toInput = jest.spyOn(CreateSchoolgroupDto.prototype, 'toInput')
            .mockReturnValueOnce(input)

        expect(await service.create(dto)).toBe(void 0);
        expect(createClass).toHaveBeenCalledTimes(1);
        expect(createClass).toHaveBeenCalledWith(input);
        expect(toInput).toHaveBeenCalledTimes(1);
        expect(createTeacher).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
        let dto = MockSchoolgroupDto.dtoToCreateCausingException();
        const createTeacher = jest.spyOn(CreateWorkerService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true))));

        const createClass = jest.spyOn(CreateClassService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.reject(new BadRequestException("Test")));
        const toInput = jest.spyOn(CreateSchoolgroupDto.prototype, 'toInput')
            .mockReturnValueOnce(input)

        try {
            await service.create(dto)
        } catch (error) {
            expect(error).toBeDefined();
            expect(createClass).toHaveBeenCalledTimes(1);
            expect(createClass).toHaveBeenCalledWith(input);
            expect(toInput).toHaveBeenCalledTimes(1);
            expect(createTeacher).toHaveBeenCalledTimes(1);
        }
    });

})