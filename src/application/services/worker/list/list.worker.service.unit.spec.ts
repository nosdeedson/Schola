import { RoleEnum } from '../../../../domain/worker/roleEnum';
import { Worker } from '../../../../domain/worker/worker'
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { FindAllWorkerService } from './list.worker.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';


describe('FindAllWorkerService unit test', () =>{
    let workers: WorkerEntity[];
    let worker : Worker;

    beforeEach(() =>{
        worker = new Worker({
            birthday: new Date(),
            name: 'edson',
            role: RoleEnum.ADMINISTRATOR,
            id: '123',
            createdAt: new Date(),
            updatedAt: new Date(),
    });

        workers = [];
        workers.push(WorkerMapper.fromDomain(worker));
    });

    it('should list all workers', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findAll = jest.fn().mockReturnValue(await Promise.resolve(workers));
        const service = new FindAllWorkerService(await workerRepository);
        const result = await service.execute();

        expect(result.all[0].birthday).toEqual(worker.getBirthday());
        expect(result.all[0].name).toEqual(worker.getName());
        expect(result.all[0].id).toEqual(worker.getId());
        expect(result.all[0].createdAt).toEqual(worker.getCreatedAt());
        expect(result.all[0].udpatedAt).toEqual(worker.getUpdatedAt());
        expect(result.all[0].role).toEqual(worker.getRole());
        expect((await workerRepository).findAll).toHaveBeenCalledTimes(1)
    })

    it('should return empty list', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        (await workerRepository).findAll = jest.fn().mockReturnValue(await Promise.resolve([]));
        const service = new FindAllWorkerService(await workerRepository);
        const result = await service.execute();

        expect(result.all.length).toBe(0);
        expect((await workerRepository).findAll).toHaveBeenCalledTimes(1)
    })

})