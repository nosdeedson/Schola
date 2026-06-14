import { Repository } from "typeorm";
import { ClassRepositoryInterface } from "../../../../domain/class/class.repository.interface";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { CreateWorkerDto } from "./create.worker.dto";
import { CreateWorkerService } from "./create.worker.service";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { Worker } from "@/domain/worker/worker";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";

describe("CreateWorkerService integration test", () => {
    let workerRepository: WorkerRepositoryInterface;
    let schoolGroupRepository: ClassRepositoryInterface;

    beforeAll(async () => {
        workerRepository = new WorkerRepository(TestDataSource);
        schoolGroupRepository = new ClassRepository(TestDataSource) as ClassRepository;
    });

    it("repositories must be instantiated", async () => {
        expect(workerRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
    })

    it('create a worker', async () => {
        let service = new CreateWorkerService(workerRepository);
        let worker = {
            name: 'edson',
            birthday: new Date(),
            role: RoleEnum.TEACHER,
            classCode: null as any,
        } as CreateWorkerDto;
        const entity = await service.execute(worker);
        expect(entity).toBeInstanceOf(Worker);
        const validation = workerRepository.find(entity.getId());
        expect(validation).toBeDefined();
    });

    it('should create a teacher with just a name', async () => {
        let service = new CreateWorkerService(workerRepository);
        let teacher = {
            name: 'just name',
            role: RoleEnum.TEACHER
        } as CreateWorkerDto;
        const entity = await service.execute(teacher) as Worker;
        expect(entity).toBeInstanceOf(Worker);
        const validation = workerRepository.find(entity.getId());
        expect(validation).toBeDefined();
    });

    it('should create a worker with class code', async () => {
        let service = new CreateWorkerService(workerRepository);
        let worker = mockWorker();
        let workerEntity = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(workerEntity)).toBeInstanceOf(Worker);
        const wantedBirthday = new Date();
        let dto = {
            name: worker.getName(),
            role: RoleEnum.TEACHER,
            classCode: '123456',
            birthday: wantedBirthday,
        } as CreateWorkerDto;
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(Worker);
        const validation = await workerRepository.find(entity.getId());
        expect(validation).toBeDefined();
        expect(validation.getName()).toBe(worker.getName());
        expect(validation.getBirthday().getTime()).toBe(wantedBirthday.getTime());
    });
});
