import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { DeleteWorkerService } from './delete.worker.service';
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";


describe('DeleteWorkerService integration test', () => {

    let workerModel;
    let workerRepository: WorkerRepository;

    beforeAll(() => {
        workerModel = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    it('repository must be instantiated', async () =>{
        expect(workerRepository).toBeDefined();
    });

    it('should delete a worker', async () =>{

        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let workerModel = WorkerEntity.toWorkerEntity(worker);

        let wantedId = worker.getId();

        expect(await workerRepository.create(workerModel)).toBeInstanceOf(WorkerEntity);

        let results = await workerRepository.findAll();
        expect(results.length).toBe(1);
        let service =  new DeleteWorkerService(workerRepository);

        await service.execute(wantedId);
        results = await workerRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].deletedAt).toBeDefined();
    })

    it('should no anything if worker does not exist', async () =>{

        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let workerModel = WorkerEntity.toWorkerEntity(worker);

        let wantedId = '00ac5b00-1326-40ce-8db9-bafaaa95f762';

        expect(await workerRepository.create(workerModel)).toBeInstanceOf(WorkerEntity);

        let result = await workerRepository.find(worker.getId());
        expect(result).toBeDefined();
        let service =  new DeleteWorkerService(workerRepository);

        await service.execute(wantedId);
        result = await workerRepository.find(worker.getId());
        expect(result.deletedAt).toBeNull();
    });

});