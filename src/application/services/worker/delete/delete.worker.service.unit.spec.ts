import { Worker } from '../../../../domain/worker/worker'
import { RoleEnum } from '../../../../domain/worker/roleEnum'
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { DeleteWorkerService } from './delete.worker.service';
import { mockWorker } from '../../../../../tests/mocks/domain/worker.mock';

describe('DeleteWorkerService unit test', () => {

    afterEach(async () => { jest.clearAllMocks() })

    it("should delete a worker ", async () => {
        const worker = mockWorker()
        const workerRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteWorkerService(workerRepository);
        expect(await service.execute(worker.getId())).toBe(void 0);
        expect(workerRepository.delete).toHaveBeenCalledTimes(1);
    })

    it("should do nothing", async () => {
        const workerRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteWorkerService(workerRepository);
        expect(await service.execute('invalid_id')).toBe(void 0);
        expect(workerRepository.delete).toHaveBeenCalledTimes(1);
    });

});
