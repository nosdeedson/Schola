import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { DeleteWorkerService } from './delete.worker.service';
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Worker } from "@/domain/worker/worker";


describe('DeleteWorkerService integration test', () => {

    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('repository must be instantiated', async () => {
        expect(workerRepository).toBeDefined();
    });

    it('should delete a worker', async () => {
        let worker = mockWorker();
        let workerModel = WorkerMapper.fromDomain(worker);
        let wantedId = worker.getId();

        expect(await workerRepository.create(workerModel)).toBeInstanceOf(Worker);

        let results = await workerRepository.findAll();
        expect(results.length).toBe(1);
        let service = new DeleteWorkerService(workerRepository);

        await service.execute(wantedId);
        results = await workerRepository.findAll();
        expect(results).toHaveLength(0);
    })

    it('should do anything if worker does not exist', async () => {

        let worker = mockWorker();
        let workerModel = WorkerMapper.fromDomain(worker);

        let wantedId = '00ac5b00-1326-40ce-8db9-bafaaa95f762';

        expect(await workerRepository.create(workerModel)).toBeInstanceOf(Worker);

        let result = await workerRepository.find(worker.getId());
        expect(result).toBeDefined();
        let service = new DeleteWorkerService(workerRepository);

        await service.execute(wantedId);
        result = await workerRepository.find(worker.getId());
        expect(result.getDeletedAt()).toBeNull();
    });

});
