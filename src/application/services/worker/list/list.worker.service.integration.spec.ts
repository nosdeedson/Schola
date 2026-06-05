import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { Worker } from "../../../../domain/worker/worker";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindAllWorkerService } from './list.worker.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";

describe('FindAllWorkerService integration tests', () => {

    let workerModel;
    let workerRepository: WorkerRepositoryInterface;

    beforeAll( async () => {
        workerModel = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () =>{
        jest.clearAllMocks();
    });

    it('repository must be instantiated', async () =>{
        expect(workerRepository).toBeDefined();
    });

    it('if none worker exist should return empty', async () =>{
        let service = new FindAllWorkerService(workerRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(0)
    })

    it('should find all worker', async () =>{
        let worker = new Worker({birthday: new Date(), name: 'one', role: RoleEnum.TEACHER, id: '1828c5d5-3947-4589-88c8-3575f6f51fcb'});
        let model = WorkerEntity.toWorkerEntity(worker);
        await workerRepository.create(model);

        let worker1 = new Worker({ birthday: new Date(), name: 'two', role: RoleEnum.ADMINISTRATOR, id: '7a856a80-ffa0-42ab-bd9d-f5fefb3407f7'});
        let model1 = WorkerEntity.toWorkerEntity(worker1);
        await workerRepository.create(model1);

        let worker2 = new Worker({ birthday: new Date(), name: 'two', role: RoleEnum.TEACHER, id: 'd5353d39-da88-46e4-ac1a-ff54dd841570'});
        let model2 = WorkerEntity.toWorkerEntity(worker2);
        await workerRepository.create(model2);

        let service = new FindAllWorkerService(workerRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(3);

    })

})