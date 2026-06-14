import { RoleEnum } from '../../../../domain/worker/roleEnum';
import { Worker } from '../../../../domain/worker/worker'
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { FindAllWorkerService } from './list.worker.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { mockWorker } from '../../../../../tests/mocks/domain/worker.mock';


describe('FindAllWorkerService unit test', () => {

    it('should list all workers', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const worker = mockWorker();
        workerRepository.findAll = jest.fn().mockReturnValue(await Promise.resolve([worker]));
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
