import { ClassRepositoryInterface } from "../../../../domain/class/class.repository.interface";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { CreateGetWorkerService } from "./create-get-worker.service";
import { AccessType } from "@/domain/user/access.type";
import { CreateWorkerDto } from "../create/create.worker.dto";
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
        let service = new CreateGetWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: "Mary Doe", birthday: new Date(), accessType: AccessType.TEACHER });
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(Worker);
        const validation = workerRepository.find(entity.getId());
        expect(validation).toBeDefined();
    });

    it('should find a worker and return it', async () => {
        let service = new CreateGetWorkerService(workerRepository);
        let worker = mockWorker();
        let workerEntity = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(workerEntity)).toBeInstanceOf(Worker);
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName() });
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(Worker);
        const validation = await workerRepository.find(entity.getId());
        expect(validation).toBeDefined();
        expect(validation.getName()).toBe(worker.getName());
    });

    it('should throw SystemError error', async () => {
        let service = new CreateGetWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: null, birthday: new Date(), accessType: AccessType.TEACHER });
        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [
                { context: 'teacher', message: 'Name should not be null' }
            ],
            "statusCode": 422
        });
    });
});
