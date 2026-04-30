import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { Worker } from "../../../../domain/worker/worker";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { UpdateWorkerService } from "../../../../application/services/worker/update/udpate.worker.service";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";

describe('UpdateWorkerService integration test', () => {

    let workerModel;
    let workerRepository: WorkerRepository;

    beforeEach(async () =>{
        workerModel = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach( async () =>{
        jest.clearAllMocks();
    });

    it('repository must be instatiated', async () =>{
        expect(workerRepository).toBeDefined();
    })

    it('should update a worker', async () => {
        let worker = new Worker({birthday: new Date(), name: 'jose', role: RoleEnum.TEACHER});
        let model = WorkerEntity.toWorkerEntity(worker);
        await workerRepository.create(model);

        let wantedId = worker.getId();
        let input = {
            id: wantedId,
            name: 'edson',
            role: RoleEnum.ADMINISTRATOR
        };

        let service = new UpdateWorkerService(workerRepository);
        expect(await service.execute(input)).toBe(void 0);

        let result = await workerRepository.find(wantedId) as WorkerEntity;
        expect(result).toBeDefined();
        expect(result.id).toEqual(input.id);
        expect(result.role).toEqual(input.role);
        expect(result.fullName).toEqual(input.name);
        expect(result.createdAt).toEqual(worker.getCreatedAt());
        expect(result.updatedAt.getTime()).toBeGreaterThan(worker.getUpdatedAt().getTime());
    } );

    it('given an invalid id should not update a worker', async () => {
        let worker = new Worker({birthday: new Date(), name: 'jose', role: RoleEnum.TEACHER});
        let model = WorkerEntity.toWorkerEntity(worker);
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
        expect(result.id).toEqual(worker.getId());
        expect(result.role).toEqual(worker.getRole());
        expect(result.fullName).toEqual(worker.getName());
        expect(result.createdAt).toEqual(worker.getCreatedAt());
        expect(result.updatedAt.getTime()).toEqual(worker.getUpdatedAt().getTime());
    } );

});