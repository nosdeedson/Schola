import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { Worker } from "../../../../domain/worker/worker";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { UpdateWorkerService } from "../../../../application/services/worker/update/udpate.worker.service";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";

describe('UpdateWorkerService integration test', () => {

    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repository must be instatiated', async () => {
        expect(workerRepository).toBeDefined();
    })

    it('should update a worker', async () => {
        let worker = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.TEACHER });
        let model = WorkerMapper.fromDomain(worker);
        await workerRepository.create(model);

        let wantedId = worker.getId();
        let input = {
            id: wantedId,
            name: 'edson',
            role: RoleEnum.ADMINISTRATOR
        };

        let service = new UpdateWorkerService(workerRepository);
        expect(await service.execute(input)).toBe(void 0);

        let result = await workerRepository.find(wantedId) as Worker;
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(input.id);
        expect(result.getRole()).toEqual(input.role);
        expect(result.getName()).toEqual(input.name);
        expect(result.getCreatedAt()).toEqual(worker.getCreatedAt());
        expect(result.getUpdatedAt().getTime()).toBeGreaterThan(worker.getUpdatedAt().getTime());
    });

    it('given an invalid id should not update a worker', async () => {
        let worker = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.TEACHER });
        let model = WorkerMapper.fromDomain(worker);
        await workerRepository.create(model);

        let nonExistentId = 'ef136581-e6f1-412a-bfe1-4db85cddcb50';
        let input = {
            id: nonExistentId,
            name: 'edson',
            role: RoleEnum.ADMINISTRATOR
        };

        let service = new UpdateWorkerService(workerRepository);
        expect(await service.execute(input)).toBe(void 0);

        let result = await workerRepository.find(worker.getId());
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(worker.getId());
        expect(result.getRole()).toEqual(worker.getRole());
        expect(result.getName()).toEqual(worker.getName());
        expect(result.getCreatedAt()).toEqual(worker.getCreatedAt());
        expect(result.getUpdatedAt().getTime()).toEqual(worker.getUpdatedAt().getTime());
    });

});
