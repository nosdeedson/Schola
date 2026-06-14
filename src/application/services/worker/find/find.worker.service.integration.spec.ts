import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindWorkerService } from './find.worker.service'
import { SystemError } from "../../@shared/system-error";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";


describe('FindWorkerService integration test', () => {

    let workerRepository: WorkerRepositoryInterface;

    beforeAll(async () => {
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repository must be instantiated', async () => {
        expect(workerRepository).toBeDefined();
    })

    it('should find a worker from BD', async () => {
        let worker = mockWorker();
        let model = WorkerMapper.fromDomain(worker);
        await workerRepository.create(model);

        let service = new FindWorkerService(workerRepository);
        let output = await service.execute(worker.getId());
        expect(output).toBeDefined();
        expect(output.id).toEqual(worker.getId());
        expect(output.birthday).toEqual(worker.getBirthday());
        expect(output.name).toEqual(worker.getName());
        expect(output.role).toEqual(worker.getRole());
        expect(output.createdAt).toEqual(worker.getCreatedAt());
    })

    it('should not find a worker if id invalid', async () => {
        let worker = mockWorker();
        let model = WorkerMapper.fromDomain(worker);
        await workerRepository.create(model);

        let nonExistentId = '31420be1-0ca7-4619-83e9-50101d9ace72'

        let service = new FindWorkerService(workerRepository);
        let output = await expect(service.execute(nonExistentId)).rejects
            .toMatchObject({ errors: [{ context: "find user", message: "Failed to find the user" }] });
    });

});
