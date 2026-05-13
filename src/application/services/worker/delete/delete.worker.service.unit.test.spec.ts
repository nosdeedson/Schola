import { Worker } from '../../../../domain/worker/worker'
import { RoleEnum } from '../../../../domain/worker/roleEnum'
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { DeleteWorkerService } from './delete.worker.service';

describe('DeleteWorkerService unit test', () => {

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
          
    });

   
    it("should delete a worker ", async () => {
        const workerRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteWorkerService(workerRepository);
        expect(await service.execute(worker.getId()));
        expect(workerRepository.delete).toHaveBeenCalledTimes(1);
    })

    it("should do nothing", async () => {
        const workerRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteWorkerService(workerRepository);
        expect(await service.execute('invalid_id'));
        expect(workerRepository.delete).toHaveBeenCalledTimes(1);
    });

});