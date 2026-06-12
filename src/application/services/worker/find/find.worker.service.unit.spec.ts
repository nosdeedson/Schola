import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { Worker } from "../../../../domain/worker/worker";
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { FindWorkerService } from './find.worker.service';
import { SystemError } from "../../@shared/system-error";


describe('FindWorkerService unit tests', () => {

    let worker: Worker;
    let workerEntity: WorkerEntity;

    beforeEach(() => {
        worker = new Worker({ birthday: new Date(), name: 'jose', role: RoleEnum.TEACHER, id: '123'});
        workerEntity = WorkerMapper.fromDomain(worker);
    });

    it('should find a worker', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.find = 
        jest.fn().mockReturnValue(await Promise.resolve(workerEntity));
        const service = new FindWorkerService(await workerRepository);
        let id = '123';
        const result = await service.execute(id);

        expect(result.id).toBe(id)
        expect(result.birthday).toEqual(worker.getBirthday())
        expect(result.createdAt).toEqual(worker.getCreatedAt())
        expect(result.id).toBe(worker.getId())
        expect(result.name).toBe(worker.getName())
        expect(result.role).toBe(worker.getRole())
        expect(result.udpatedAt).toEqual(worker.getUpdatedAt())
        expect((await workerRepository).find).toHaveBeenCalledTimes(1)
        expect((await workerRepository).find).toHaveBeenCalledWith(id)
    })

    it('should return empty result for a worker', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        (await workerRepository).find = jest.fn().mockReturnValueOnce(await Promise.resolve(null))
        const service = new FindWorkerService(await workerRepository);
        let id = '123';
        try {
            const result = await service.execute(id);
        } catch (error) {
            expect(error).toBeInstanceOf(SystemError);
            expect((await workerRepository).find).toHaveBeenCalledTimes(1)
            expect((await workerRepository).find).toHaveBeenCalledWith(id)
        }
    });
});